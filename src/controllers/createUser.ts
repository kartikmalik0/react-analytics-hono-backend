import { Context } from "hono";
import { getPrisma } from "../db/prisma";
import { env } from "hono/adapter";

export const createUser = async (c: Context) => {
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
    console.log(c.req.json);

    try {
        const { name, email } = await c.req.json();

        if (!name || !email) {
            return c.json({ erro: "Name and email are requred" }, 400);
        }

        const prisma = getPrisma(DATABASE_URL);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
            },
        });

        return c.json({ data: newUser }, 201);
    } catch (error: any) {
        if (error.code === "P2002") {
            return c.json({ error: "Email already exists" }, 409);
        }

        // Handle other errors
        return c.json(
            { error: "Error creating user", details: error.message },
            500
        );
    }
};
