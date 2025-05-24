import { Hono } from "hono";
import { verify } from "hono/jwt";

const app = new Hono();

app.get("/livez", (c) => {
  return c.text("live");
});

app.get("/readyz", (c) => {
  return c.text("ready");
});

const JWT_SECRET = Bun.env.JWT_SECRET;

app.get("/auth", async (c) => {
  try {
    const token = c.req.header("Authorization")?.slice(7);

    if (!token) {
      return c.body(null, 204);
    }

    const { id, role, email } = await verify(token, JWT_SECRET);

    c.header("X-User-Id", id as string);
    c.header("X-User-Role", role as string);
    c.header("X-User-Email", email as string);

    return c.body(null, 204);
  } catch {
    return c.body(null, 204);
  }
});

app.get("/whoami", async (c) => {
  const id = c.req.header("X-User-Id") ?? null;
  const role = c.req.header("X-User-Role") ?? null;
  const email = c.req.header("X-User-Email") ?? null;
  return c.json({ id, role, email });
});

export default app;
