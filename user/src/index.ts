import "@/events/kafka";
import { sql } from "bun";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { isValiError } from "valibot";
import { authController } from "./controllers/auth";
import { clinicController } from "./controllers/clinic";
import { clinicAdminController } from "./controllers/clinic-admin";
import { doctorController } from "./controllers/doctor";
import { metaController } from "./controllers/meta";
import { oauthController } from "./controllers/oauth";
import { otpVerificationController } from "./controllers/otp-verification";
import { patientController } from "./controllers/patient";
import { platformAdminController } from "./controllers/platform-admin";

const app = new Hono();

// Liveness 探针。
app.get("/livez", (c) => {
  return c.text("live");
});

// Readiness 探针。
app.get("/readyz", async (c) => {
  await sql`select 1`;
  return c.text("ready");
});

// API 端点。
app.route("/auth", authController);
app.route("/oauth", oauthController);
app.route("/otp", otpVerificationController);
app.route("/platform-admins", platformAdminController);
app.route("/clinics", clinicController);
app.route("/clinic-admins", clinicAdminController);
app.route("/doctors", doctorController);
app.route("/patients", patientController);
app.route("/meta/user", metaController);

// 集中处理错误。
app.onError((error, c) => {
  if (isValiError(error)) {
    if (Bun.env.NODE_ENV === "development") {
      console.error(error);
    }
    return c.json({ code: 400, message: error.message, data: null }, 400);
  }

  if (error instanceof HTTPException) {
    return c.json(
      { code: error.status, message: error.message, data: null },
      error.status,
    );
  }

  console.error(error);
  return c.json({ code: 500, message: "Server error", data: null }, 500);
});

export default app;
