import {
  emailSchema,
  idSchema,
  otpSchema,
  passwordSchema,
} from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as patientService from "@/services/patient";
import { Hono } from "hono";
import * as v from "valibot";

export const patientController = new Hono();

patientController.get(
  "/:id",
  authGuard(["doctor"]),
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const patient = await patientService.findOneById(id);
    return c.json({ code: 0, message: "", data: patient });
  },
);

patientController.post(
  "/",
  validator(
    "json",
    v.object({ email: emailSchema, password: passwordSchema, otp: otpSchema }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const patientWithToken = await patientService.createOne(data);
    return c.json({ code: 0, message: "", data: patientWithToken }, 201);
  },
);
