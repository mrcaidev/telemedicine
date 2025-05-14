import {
  emailSchema,
  firstNameSchema,
  idSchema,
  lastNameSchema,
  passwordSchema,
} from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as clinicAdminService from "@/services/clinic-admin";
import { Hono } from "hono";
import * as v from "valibot";

export const clinicAdminController = new Hono();

clinicAdminController.get(
  "/",
  authGuard(["platform_admin"]),
  validator("query", v.object({ clinicId: v.optional(idSchema) })),
  async (c) => {
    const query = c.req.valid("query");
    const clinicAdmins = await clinicAdminService.findMany(query);
    return c.json({ code: 0, message: "", data: clinicAdmins });
  },
);

clinicAdminController.get(
  "/:id",
  authGuard(["platform_admin"]),
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const clinicAdmin = await clinicAdminService.findOneById(id);
    return c.json({ code: 0, message: "", data: clinicAdmin });
  },
);

clinicAdminController.post(
  "/",
  authGuard(["platform_admin"]),
  validator(
    "json",
    v.object({
      email: emailSchema,
      password: passwordSchema,
      clinicId: idSchema,
      firstName: firstNameSchema,
      lastName: lastNameSchema,
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const clinicAdmin = await clinicAdminService.createOne(data, actor);
    return c.json({ code: 0, message: "", data: clinicAdmin }, 201);
  },
);
