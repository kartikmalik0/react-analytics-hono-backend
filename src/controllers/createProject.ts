import { Context } from "hono";
import { getPrisma } from "../db/prisma";
import { env } from "hono/adapter";

export const createProject = async (c: Context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  try {
    // Extract project data from the request body
    const { name, ownerId } = await c.req.json();

    // Validate required fields
    if (!name || !ownerId) {
      return c.json({ error: "Project name and ownerId are required" }, 400);
    }

    // Initialize Prisma client
    const prisma = getPrisma(DATABASE_URL);

    // Check if the user (owner) exists
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return c.json({ error: "User not found" }, 404);
    }

    // Generate a unique secret for the project

    // Create the new project in the database
    const newProject = await prisma.project.create({
      data: {
        name,        // Project name
        ownerId,     // Link the project to the user (owner)
      },
    });

    // Return the newly created project
    return c.json({ data: newProject }, 201);
  } catch (error: any) {
    // Handle errors
    if (error.code === "P2002") {
      return c.json({ error: "Project name or secret already exists" }, 409);
    }

    return c.json(
      { error: "Error creating project", details: error.message },
      500
    );
  }
};
