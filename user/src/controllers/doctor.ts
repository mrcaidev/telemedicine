import { validator } from "@/middleware/validator";
import * as doctorService from "@/services/doctor";
import { Hono } from "hono";
import * as v from "valibot";

export const doctorController = new Hono();

doctorController.get(
  "/:id",
  validator(
    "param",
    v.object({
      id: v.pipe(v.string(), v.uuid("Invalid ID")),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const doctor = await doctorService.findOneById(id);
    return c.json({ code: 0, message: "", data: doctor });
  },
);
