import {
  emailSchema,
  firstNameSchema,
  genderSchema,
  lastNameSchema,
  passwordSchema,
  uuidSchema,
} from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as doctorService from "@/services/doctor";
import { Hono } from "hono";
import * as v from "valibot";

export const doctorController = new Hono();

doctorController.get(
  "/:id",
  validator("param", v.object({ id: uuidSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const doctor = await doctorService.findOneById(id);
    return c.json({ code: 0, message: "", data: doctor });
  },
);

doctorController.post(
  "/",
  authGuard(["clinic_admin"]),
  validator(
    "json",
    v.object({
      email: emailSchema,
      password: passwordSchema,
      firstName: firstNameSchema,
      lastName: lastNameSchema,
      gender: genderSchema,
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const userId = c.get("userId");
    const doctor = await doctorService.createOne(data, userId);
    return c.json({ code: 0, message: "", data: doctor }, 201);
  },
);
