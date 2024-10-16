import { Hono } from "hono";
import { testUserRoutes } from "./routes/testuser";
import { userRoutes } from "./routes/create-user";
import { env } from "hono/adapter";
import { Context } from "hono";

const app = new Hono<{
    Bindings: {
      DATABASE_URL: string
    //   JWT_SECRET: string
    }
  }>()

app.route("/user", testUserRoutes);
app.route("/create-user",userRoutes)

app.get('/env', (c:Context) => {
  // NAME is process.env.NAME on Node.js or Bun
  // NAME is the value written in `wrangler.toml` on Cloudflare
  const { MY_VAR } = env<{ MY_VAR: string }>(c)
  return c.text(MY_VAR)
})


export default app;
