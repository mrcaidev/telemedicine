import { validator } from "@/middleware/validator";
import * as otpVerificationService from "@/services/otp-verification";
import { Hono } from "hono";
import * as v from "valibot";

export const otpVerificationController = new Hono();

otpVerificationController.post(
  "/",
  validator(
    "json",
    v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
    }),
  ),
  async (c) => {
    const { email } = c.req.valid("json");
    await otpVerificationService.sendOtp(email);
    return c.json({ code: 0, message: "", data: null }, 201);
  },
);
