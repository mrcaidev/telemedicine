import {
  birthDateSchema,
  emailSchema,
  genderSchema,
  idSchema,
  nicknameSchema,
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

patientController.patch(
  "/:id",
  authGuard(["patient"]),
  validator("param", v.object({ id: idSchema })),
  validator(
    "json",
    v.object({
      nickname: v.optional(nicknameSchema),
      gender: v.optional(genderSchema),
      birthDate: v.optional(birthDateSchema),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const patient = await patientService.updateOneById(id, data, actor);
    return c.json({ code: 0, message: "", data: patient });
  },
);
