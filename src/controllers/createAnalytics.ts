import { Context } from "hono";
import { getPrisma } from "../db/prisma";
import { env } from "hono/adapter";
import { z } from "zod";

const analyticsSchema = z.object({
    secret: z.string(),
    url: z.string().url(),
    userAgent: z.string(),
    language: z.string(),
    referrer: z.string(),
    platform: z.string(),
    screenResolution: z.string(),
    colorDepth: z.number().int().positive(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    accuracy: z.number().optional(),
    ip: z.string().ip().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    country: z.string().optional(),
});

export const createAnalytics = async (c: Context) => {
    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

    try {
        const analyticsData = analyticsSchema.parse(await c.req.json());
        const prisma = getPrisma(DATABASE_URL);
        const { secret, city, region, country,referrer, ...data } = analyticsData;

        const project = await prisma.project.findUnique({
            where: { id: secret },
        });

        if (!project) {
            return c.json({ error: "Invalid project secret" }, 400);
        }

        const updatedAnalytics = await prisma.analytics.upsert({
            where: { projectId: secret },
            create: {
                ...data,
                projectId: secret,
                cities: city ? [city] : [],
                countries: country ? [country] : [],
                regions: region ? [region] : [],
                referrers: referrer ? [referrer] :[],
                views: 1,
            },
            update: {
                views: { increment: 1 },
                cities: city ? { push: city } : undefined,
                countries: country ? { push: country } : undefined,
                regions: region ? { push: region } : undefined,
                referrers: referrer ? { push: referrer } : undefined,
            },
        });

        return c.json({ data: updatedAnalytics }, 200);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return c.json(
                { error: "Invalid input", details: error.errors },
                400
            );
        }

        console.error("Error creating/updating analytics entry:", error);
        return c.json({ error: "Error creating/updating analytics entry" }, 500);
    }
};