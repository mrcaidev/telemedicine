import { emailSchema, otpSchema, passwordSchema } from "@/common/schema";
import { validator } from "@/middleware/validator";
import * as patientService from "@/services/patient";
import { Hono } from "hono";
import * as v from "valibot";

export const patientController = new Hono();

patientController.post(
  "/",
  validator(
    "json",
    v.object({ email: emailSchema, password: passwordSchema, otp: otpSchema }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const patientWithToken = await patientService.createPatient(data);
    return c.json({ code: 0, message: "", data: patientWithToken }, 201);
  },
);
