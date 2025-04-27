import { validator } from "@/middleware/validator";
import * as patientService from "@/services/patient";
import { Hono } from "hono";
import * as v from "valibot";

export const patientController = new Hono();

patientController.post(
  "/:id",
  validator(
    "json",
    v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
      password: v.pipe(
        v.string(),
        v.minLength(
          8,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
        v.maxLength(
          20,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
        v.regex(
          /[A-Za-z]/,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
        v.regex(
          /\d/,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
        v.regex(
          /[`~!@#$%^&*()\-_=+\[{\]}\\|;:'",<.>\/?]/,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
      ),
      otp: v.pipe(
        v.string(),
        v.length(6, "OTP should be 6 digits"),
        v.digits("OTP should be 6 digits"),
      ),
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const patientWithToken = await patientService.createPatient(data);
    return c.json({ code: 0, message: "", data: patientWithToken }, 201);
  },
);
