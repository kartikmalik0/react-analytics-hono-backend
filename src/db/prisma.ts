import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Ensure Prisma client is properly initialized with the database URL
export const getPrisma = (database_url: string) => {
    if (!database_url) {
        throw new Error(`DATABASE_URL is not set ${database_url}`);
    }

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: database_url,
            },
        },
    }).$extends(withAccelerate());

    return prisma;
};
