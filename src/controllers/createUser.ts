import { Context } from "hono";
import { getPrisma } from "../db/prisma";
import { env } from "hono/adapter";

export const createUser = async (c: Context) => {
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

    try {
        // Extract user object from request body
        const { name, email, image } = await c.req.json();

        // Validate required fields
        if (!name || !email) {
            return c.json({ error: "Name and email are required" }, 400);
        }

        // Initialize Prisma client
        const prisma = getPrisma(DATABASE_URL);

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { email }, // Look for user by email
        });

        if (existingUser) {
            // User exists, return their data
            return c.json({ data: existingUser }, 200);
        }

        // Create a new user in the database
        const newUser = await prisma.user.create({
            data: {      
                name,     // User's name
                email,    // User's email
                image,    // Optional: User's profile image
            },
        });

        // Return the newly created user data
        return c.json({ data: newUser }, 201);
    } catch (error: any) {
        // Handle unique constraint error (e.g., duplicate email)
        if (error.code === "P2002") {
            return c.json({ error: "Email already exists" }, 409);
        }

        // Handle other errors and provide detailed error messages
        return c.json(
            { error: "Error creating user", details: error.message },
            500
        );
    }
};
