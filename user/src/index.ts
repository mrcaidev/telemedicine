import { sql } from "bun";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { isValiError } from "valibot";
import { authController } from "./controllers/auth";
import { authGatewayController } from "./controllers/auth-gateway";
import { otpVerificationController } from "./controllers/otp-verification";
import { patientController } from "./controllers/patient";

const app = new Hono();

app.use(logger());

app.get("/livez", (c) => {
  return c.text("live");
});

app.get("/readyz", async (c) => {
  await sql`select 1`;
  return c.text("ready");
});

app.route("/auth-gateway", authGatewayController);
app.route("/otp", otpVerificationController);
app.route("/auth", authController);
app.route("/patients", patientController);

app.onError((error, c) => {
  if (isValiError(error)) {
    return c.json({ code: 400, message: error.message, data: null }, 400);
  }

  if (error instanceof HTTPException) {
    return c.json(
      { code: error.status, message: error.message, data: null },
      error.status,
    );
  }

  console.error(error);
  return c.json({ code: 500, message: "Unknown error", data: null }, 500);
});

export default app;
