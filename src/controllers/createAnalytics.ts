import { Context } from "hono";
import { z } from "zod";
import { getPrisma } from "../db/prisma";
import { env } from "hono/adapter";


const analyticsSchema = z.object({
  projectId: z.string().uuid(),
  url: z.string().url(),
  visitorId: z.string(),
  userAgent: z.string(),
  language: z.string(),
  platform: z.enum(["DESKTOP", "MOBILE", "TABLET"]),
  screenResolution: z.string(),
  colorDepth: z.number().int().positive(),
  ip: z.string().ip().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  accuracy: z.number().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  referrer: z.string().url().optional(),
});

export const createAnalytics = async (c: Context) => {

    const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  try {
    const data = analyticsSchema.parse(await c.req.json());

    
    const prisma = getPrisma(DATABASE_URL);
    // Check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Create or update visitor
    const visitor = await prisma.visitor.upsert({
      where: {
        projectId_visitorId: {
          projectId: data.projectId,
          visitorId: data.visitorId,
        },
      },
      update: {
        lastVisit: new Date(),
      },
      create: {
        projectId: data.projectId,
        visitorId: data.visitorId,
        userAgent: data.userAgent,
        language: data.language,
        platform: data.platform,
        screenResolution: data.screenResolution,
        colorDepth: data.colorDepth,
      },
    });

    // Create page view
    const pageView = await prisma.pageView.create({
      data: {
        projectId: data.projectId,
        url: data.url,
      },
    });

    // Create location data if provided
    if (data.ip || data.latitude || data.longitude) {
      await prisma.location.create({
        data: {
          projectId: data.projectId,
          visitorId: data.visitorId,
          ip: data.ip,
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          city: data.city,
          region: data.region,
          country: data.country,
        },
      });
    }

    // Update daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.dailyStats.upsert({
      where: {
        projectId_date: {
          projectId: data.projectId,
          date: today,
        },
      },
      update: {
        views: { increment: 1 },
        visitors: { increment: 1 },
        newVisitors: visitor.firstVisit === visitor.lastVisit ? { increment: 1 } : { increment: 0 },
      },
      create: {
        projectId: data.projectId,
        date: today,
        views: 1,
        visitors: 1,
        newVisitors: 1,
      },
    });

    // Update referrer if provided
    if (data.referrer) {
      await prisma.referrer.upsert({
        where: {
          projectId_url: {
            projectId: data.projectId,
            url: data.referrer,
          },
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          projectId: data.projectId,
          url: data.referrer,
          count: 1,
        },
      });
    }

    return c.json({ success: true, pageViewId: pageView.id }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid input", details: error.errors }, 400);
    }

    console.error("Error creating analytics:", error);
    return c.json({ error: "Error creating analytics" }, 500);
  }
};

// Dummy data to test createAnalytics
const dummyAnalyticsData = {
  projectId: "123e4567-e89b-12d3-a456-426614174001", // Assuming this UUID exists in the Project table
  url: "https://example.com/page",
  visitorId: "unique-visitor-id-123",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  language: "en-US",
  platform: "DESKTOP",
  screenResolution: "1920x1080",
  colorDepth: 24,
  ip: "192.168.1.1",
  latitude: 40.7128,
  longitude: -74.0060,
  accuracy: 100,
  city: "New York",
  region: "NY",
  country: "USA",
  referrer: "https://google.com",
};

// Test the createAnalytics function
// createAnalytics({ req: { json: () => Promise.resolve(dummyAnalyticsData) }, json: console.log } as any);