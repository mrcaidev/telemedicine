import { emailSchema, passwordSchema, uuidSchema } from "@/common/schema";
import { validator } from "@/middleware/validator";
import * as platformAdminService from "@/services/platform-admin";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import * as v from "valibot";

export const platformAdminController = new Hono();

platformAdminController.get(
  "/:id",
  bearerAuth({ token: Bun.env.SUPER_ADMIN_TOKEN }),
  validator("param", v.object({ id: uuidSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const platformAdmin = await platformAdminService.findById(id);
    return c.json({ code: 0, message: "", data: platformAdmin });
  },
);

platformAdminController.post(
  "/",
  bearerAuth({ token: Bun.env.SUPER_ADMIN_TOKEN }),
  validator("json", v.object({ email: emailSchema, password: passwordSchema })),
  async (c) => {
    const data = c.req.valid("json");
    const platformAdmin = await platformAdminService.create(data);
    return c.json({ code: 0, message: "", data: platformAdmin }, 201);
  },
);
