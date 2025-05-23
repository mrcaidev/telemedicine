import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  uuidSchema,
} from "@/common/schema";
import { rbac } from "@/middleware/rbac";
import { validator } from "@/middleware/validator";
import * as clinicAdminService from "@/services/clinic-admin";
import { Hono } from "hono";
import * as v from "valibot";

export const clinicAdminController = new Hono();

clinicAdminController.get(
  "/",
  rbac(["platform_admin"]),
  validator("query", v.object({ clinicId: v.optional(uuidSchema) })),
  async (c) => {
    const query = c.req.valid("query");
    const clinicAdmins = await clinicAdminService.findMany(query);
    return c.json({ code: 0, message: "", data: clinicAdmins });
  },
);

clinicAdminController.get(
  "/:id",
  rbac(["platform_admin"]),
  validator("param", v.object({ id: uuidSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const clinicAdmin = await clinicAdminService.findById(id);
    return c.json({ code: 0, message: "", data: clinicAdmin });
  },
);

clinicAdminController.post(
  "/",
  rbac(["platform_admin"]),
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
    const actor = c.get("actor");
    const clinicAdmin = await clinicAdminService.create(data, actor);
    return c.json({ code: 0, message: "", data: clinicAdmin }, 201);
  },
);

clinicAdminController.patch(
  "/:id",
  rbac(["platform_admin"]),
  validator("param", v.object({ id: uuidSchema })),
  validator(
    "json",
    v.object({
      firstName: v.optional(firstNameSchema),
      lastName: v.optional(lastNameSchema),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const clinicAdmin = await clinicAdminService.updateById(id, data);
    return c.json({ code: 0, message: "", data: clinicAdmin });
  },
);

clinicAdminController.delete(
  "/:id",
  rbac(["platform_admin"]),
  validator("param", v.object({ id: uuidSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    await clinicAdminService.deleteById(id, actor);
    return c.json({ code: 0, message: "", data: null });
  },
);
