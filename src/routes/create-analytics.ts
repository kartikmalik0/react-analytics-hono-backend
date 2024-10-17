import { Hono } from "hono";
import * as analyticsControllers from "../controllers/createAnalytics";

const analyticsRoutes = new Hono();

analyticsRoutes.post("/", analyticsControllers.createAnalytics);

export {analyticsRoutes}