import { Hono } from "hono";
import { userRoutes } from "./routes/user";

const app = new Hono();

app.route("/user", userRoutes);

export default app;
