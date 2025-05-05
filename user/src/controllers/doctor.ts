import {
  emailSchema,
  firstNameSchema,
  idSchema,
  lastNameSchema,
  passwordSchema,
} from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as doctorService from "@/services/doctor";
import { Hono } from "hono";
import * as v from "valibot";

export const doctorController = new Hono();

doctorController.get(
  "/:id",
  validator("param", v.object({ id: idSchema })),
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
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const doctor = await doctorService.createOne(data, actor);
    return c.json({ code: 0, message: "", data: doctor }, 201);
  },
);
