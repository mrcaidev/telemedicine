import { sql } from "bun";
import { type Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { isValiError } from "valibot";
import { authController } from "./controllers/auth";
import { otpVerificationController } from "./controllers/otp-verification";
import { verifyJwt } from "./utils/jwt";

const app = new Hono();

app.use(logger());

app.get("/livez", (c) => {
  return c.text("live");
});

app.get("/readyz", async (c) => {
  await sql`select now()`;
  return c.text("ready");
});

app.get("/gateway", async (c) => {
  try {
    const token = c.req.header("Authorization")?.slice(7);
    if (!token) {
      return c.body(null, 204);
    }

    const { id, role } = await verifyJwt(token);
    c.header("X-User-Id", id);
    c.header("X-User-Role", role);
    return c.body(null, 204);
  } catch {
    return c.body(null, 204);
  }
});

app.route("/auth", authController);
app.route("/otp", otpVerificationController);

app.onError((error: unknown, c: Context) => {
  if (isValiError(error)) {
    return c.json({ error: error.message }, 400);
  }

  if (error instanceof HTTPException) {
    return c.json({ error: error.message }, error.status);
  }

  console.error(error);
  return c.json({ error: "Server error" }, 500);
});

export default app;
