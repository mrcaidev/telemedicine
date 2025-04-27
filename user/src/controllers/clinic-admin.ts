import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  uuidSchema,
} from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as clinicAdminService from "@/services/clinic-admin";
import { Hono } from "hono";
import * as v from "valibot";

export const clinicAdminController = new Hono();

clinicAdminController.post(
  "/",
  authGuard(["platform_admin"]),
  validator(
    "json",
    v.object({
      email: emailSchema,
      password: passwordSchema,
      clinicId: uuidSchema,
      firstName: firstNameSchema,
      lastName: lastNameSchema,
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const userId = c.get("userId");
    const clinicAdmin = await clinicAdminService.createOne(data, userId);
    return c.json({ code: 0, message: "", data: clinicAdmin });
  },
);
