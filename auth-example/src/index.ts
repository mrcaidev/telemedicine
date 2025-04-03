import { Hono } from "hono";
import { verify } from "hono/jwt";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

app.get("/livez", (c) => {
  return c.text("ok");
});

app.get("/readyz", (c) => {
  return c.text("ok");
});

app.get("/gateway", async (c) => {
  try {
    const token = c.req.header("Authorization")?.slice(7);

    if (!token) {
      return c.body(null, 204);
    }

    const payload = await verify(token, "a-string-secret-at-least-256-bits-long");

    const { id, role } = payload as { id: string; role: string };

    c.header("X-User-Id", id);
    c.header("X-User-Role", role);
    return c.body(null, 204);
  } catch {
    return c.body(null, 204);
  }
});

export default app;
