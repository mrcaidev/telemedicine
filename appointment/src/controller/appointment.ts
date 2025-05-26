import { rbac } from "@/middleware/rbac";
import { validator } from "@/middleware/validator";
import * as appointmentService from "@/services/appointment";
import { Hono } from "hono";
import * as v from "valibot";

export const appointmentController = new Hono();

appointmentController.get(
  "/",
  rbac(["patient", "doctor", "clinic_admin"]),
  validator(
    "query",
    v.object({
      clinicId: v.optional(v.pipe(v.string(), v.uuid())),
      status: v.optional(
        v.pipe(
          v.string(),
          v.transform((value) => [
            ...new Set(value.split(",").map((s) => s.trim())),
          ]),
          v.array(
            v.union([
              v.literal("normal"),
              v.literal("to_be_rescheduled"),
              v.literal("cancelled"),
            ]),
          ),
          v.minLength(1),
        ),
        "normal,to_be_rescheduled,cancelled",
      ),
      sortBy: v.optional(
        v.union([v.literal("startAt"), v.literal("endAt")]),
        "endAt",
      ),
      sortOrder: v.optional(
        v.union([v.literal("asc"), v.literal("desc")]),
        "asc",
      ),
      limit: v.optional(
        v.pipe(
          v.string(),
          v.transform(Number),
          v.number(),
          v.integer(),
          v.minValue(1),
          v.maxValue(100),
        ),
        "10",
      ),
      cursor: v.optional(v.pipe(v.string(), v.isoTimestamp())),
    }),
  ),
  async (c) => {
    const query = { cursor: new Date().toISOString(), ...c.req.valid("query") };
    const actor = c.get("actor");
    const page = await appointmentService.paginate(query, actor);
    return c.json({ code: 0, message: "", data: page });
  },
);

appointmentController.get(
  "/:id",
  rbac(["patient", "doctor"]),
  validator("param", v.object({ id: v.pipe(v.string(), v.uuid()) })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    const appointment = await appointmentService.findOneById(id, actor);
    return c.json({ code: 0, message: "", data: appointment });
  },
);

appointmentController.post(
  "/",
  rbac(["patient"]),
  validator(
    "json",
    v.object({
      availabilityId: v.pipe(v.string(), v.uuid()),
      remark: v.pipe(v.string(), v.maxLength(200)),
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const appointment = await appointmentService.book(data, actor);
    return c.json({ code: 0, message: "", data: appointment }, 201);
  },
);

appointmentController.post(
  "/:id/request-reschedule",
  rbac(["doctor"]),
  validator("param", v.object({ id: v.pipe(v.string(), v.uuid()) })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    const appointment = await appointmentService.requestReschedule(id, actor);
    return c.json({ code: 0, message: "", data: appointment });
  },
);

appointmentController.post(
  "/:id/cancel",
  rbac(["patient"]),
  validator("param", v.object({ id: v.pipe(v.string(), v.uuid()) })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    const appointment = await appointmentService.cancel(id, actor);
    return c.json({ code: 0, message: "", data: appointment });
  },
);
