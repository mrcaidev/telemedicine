import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as clinicService from "@/services/clinic";
import { Hono } from "hono";
import * as v from "valibot";

export const clinicController = new Hono();

clinicController.post(
  "/",
  authGuard(["platform_admin"]),
  validator(
    "json",
    v.object({
      name: v.string(),
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const userId = c.get("userId");
    const clinic = await clinicService.createOne(data, userId);
    return c.json({ code: 0, message: "", data: clinic }, 201);
  },
);
