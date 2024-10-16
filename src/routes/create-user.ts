import { Hono } from "hono";
import * as userController from "../controllers/createUser";

const userRoutes = new Hono();

userRoutes.post("/", userController.createUser);

export {userRoutes}