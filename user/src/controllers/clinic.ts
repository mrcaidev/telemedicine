import { uuidSchema } from "@/common/schema";
import { rbac } from "@/middleware/rbac";
import { validator } from "@/middleware/validator";
import * as clinicService from "@/services/clinic";
import { Hono } from "hono";
import * as v from "valibot";

export const clinicController = new Hono();

clinicController.get("/", async (c) => {
  const clinics = await clinicService.findMany();
  return c.json({ code: 0, message: "", data: clinics });
});

clinicController.get(
  "/:id",
  validator("param", v.object({ id: uuidSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const clinic = await clinicService.findById(id);
    return c.json({ code: 0, message: "", data: clinic });
  },
);

clinicController.post(
  "/",
  rbac(["platform_admin"]),
  validator("json", v.object({ name: v.string() })),
  async (c) => {
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const clinic = await clinicService.create(data, actor);
    return c.json({ code: 0, message: "", data: clinic }, 201);
  },
);

clinicController.patch(
  "/:id",
  rbac(["platform_admin"]),
  validator("param", v.object({ id: uuidSchema })),
  validator("json", v.object({ name: v.optional(v.string()) })),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const clinic = await clinicService.updateById(id, data);
    return c.json({ code: 0, message: "", data: clinic });
  },
);

clinicController.delete(
  "/:id",
  rbac(["platform_admin"]),
  validator("param", v.object({ id: uuidSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    await clinicService.deleteById(id, actor);
    return c.json({ code: 0, message: "", data: null });
  },
);
