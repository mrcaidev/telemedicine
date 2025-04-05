import { validator } from "@/middleware/validator";
import * as otpVerificationService from "@/services/otp-verification";
import { Hono } from "hono";
import * as v from "valibot";

export const otpVerificationController = new Hono();

otpVerificationController.post(
  "/send",
  validator(
    "json",
    v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
    }),
  ),
  async (c) => {
    const { email } = c.req.valid("json");
    await otpVerificationService.sendOtp(email);
    return c.body(null, 204);
  },
);

otpVerificationController.post(
  "/verify",
  validator(
    "json",
    v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
      otp: v.pipe(
        v.string(),
        v.digits("OTP should be 6 digits"),
        v.length(6, "OTP should be 6 digits"),
      ),
    }),
  ),
  async (c) => {
    const { email, otp } = c.req.valid("json");
    await otpVerificationService.verifyOtp(email, otp);
    return c.body(null, 204);
  },
);
