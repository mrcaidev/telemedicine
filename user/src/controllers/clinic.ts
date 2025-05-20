import { idSchema } from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as clinicService from "@/services/clinic";
import { Hono } from "hono";
import * as v from "valibot";

export const clinicController = new Hono();

clinicController.get("/", async (c) => {
  const clinics = await clinicService.findAll();
  return c.json({ code: 0, message: "", data: clinics });
});

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

clinicController.patch(
  "/:id",
  authGuard(["platform_admin"]),
  validator("param", v.object({ id: idSchema })),
  validator("json", v.object({ name: v.optional(v.string()) })),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const clinic = await clinicService.updateOneById(id, data);
    return c.json({ code: 0, message: "", data: clinic });
  },
);

clinicController.delete(
  "/:id",
  authGuard(["platform_admin"]),
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    await clinicService.deleteOneById(id, actor);
    return c.json({ code: 0, message: "", data: null });
  },
);
