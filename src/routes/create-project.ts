import { Hono } from "hono";
import * as projectControllers from "../controllers/createProject";

const projectRoutes = new Hono();

projectRoutes.post("/", projectControllers.createProject);

export {projectRoutes}