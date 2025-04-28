import { sql } from "bun";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

app.get("/livez", (c) => {
  return c.text("live");
});

app.get("/readyz", async (c) => {
  await sql`select 1`;
  return c.text("ready");
});

export default app;
