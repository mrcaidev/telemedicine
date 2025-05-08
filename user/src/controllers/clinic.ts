import { idSchema } from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as clinicService from "@/services/clinic";
import { Hono } from "hono";
import * as v from "valibot";

export const clinicController = new Hono();

clinicController.get(
  "/:id",
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const clinic = await clinicService.findOneById(id);
    return c.json({ code: 0, message: "", data: clinic });
  },
);

clinicController.post(
  "/",
  authGuard(["platform_admin"]),
  validator("json", v.object({ name: v.string() })),
  async (c) => {
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const clinic = await clinicService.createOne(data, actor);
    return c.json({ code: 0, message: "", data: clinic }, 201);
  },
);
