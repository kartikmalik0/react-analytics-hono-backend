import { Context } from "hono";
import { getPrisma } from "../db/prisma";
import { env } from "hono/adapter";
import { z } from "zod";

const projectSchema = z.object({
    name: z.string().min(1),
    ownerId: z.string().uuid(),
});

export const createProject = async (c: Context) => {

    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
    try {
        const { name, ownerId } = projectSchema.parse(await c.req.json());

        const prisma = getPrisma(DATABASE_URL);

        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: ownerId },
        });

        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        // Create the new project
        const newProject = await prisma.project.create({
            data: {
                name,
                ownerId,
            },
        });

        return c.json({ data: newProject }, 201);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return c.json(
                { error: "Invalid input", details: error.errors },
                400
            );
        }

        if (error?.code === "P2002") {
            return c.json(
                { error: "Project name already exists for this user" },
                409
            );
        }

        console.error("Error creating project:", error);
        return c.json({ error: "Error creating project" }, 500);
    }
};

// Dummy data to test createProject
const dummyProjectData = {
    name: "My Test Project",
    ownerId: "123e4567-e89b-12d3-a456-426614174000", // Assuming this UUID exists in the User table
};

// Test the createProject function
// createProject({ req: { json: () => Promise.resolve(dummyProjectData) }, json: console.log } as any);
