import { idSchema, remarkSchema } from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as appointmentService from "@/services/appointment";
import { Hono } from "hono";
import * as v from "valibot";

export const appointmentController = new Hono();

appointmentController.get(
  "/",
  authGuard(["patient", "doctor"]),
  validator(
    "query",
    v.object({
      sortBy: v.optional(
        v.union(
          [v.literal("startAt"), v.literal("endAt")],
          "sortBy should be either 'startAt' or 'endAt'",
        ),
        "endAt",
      ),
      sortOrder: v.optional(
        v.union(
          [v.literal("asc"), v.literal("desc")],
          "sortOrder should be either 'asc' or 'desc'",
        ),
        "asc",
      ),
      limit: v.optional(
        v.pipe(
          v.string(),
          v.transform(Number),
          v.number("limit should be an integer between 1 and 100"),
          v.integer("limit should be an integer between 1 and 100"),
          v.minValue(1, "limit should be an integer between 1 and 100"),
          v.maxValue(100, "limit should be an integer between 1 and 100"),
        ),
        "10",
      ),
      cursor: v.optional(
        v.pipe(
          v.string(),
          v.isoTimestamp("cursor should be an ISO 8601 timestamp"),
        ),
        new Date().toISOString(),
      ),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const actor = c.get("actor");
    const page = await appointmentService.findAll(query, actor);
    return c.json({ code: 0, message: "", data: page });
  },
);

appointmentController.get(
  "/:id",
  authGuard(["patient", "doctor"]),
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    const appointment = await appointmentService.findOneById(id, actor);
    return c.json({ code: 0, message: "", data: appointment });
  },
);

appointmentController.post(
  "/",
  authGuard(["patient"]),
  validator(
    "json",
    v.object({ availabilityId: idSchema, remark: remarkSchema }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const appointment = await appointmentService.bookOne(data, actor);
    return c.json({ code: 0, message: "", data: appointment }, 201);
  },
);

appointmentController.post(
  "/:id/request-reschedule",
  authGuard(["doctor"]),
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    const appointment = await appointmentService.requestRescheduleOneById(
      id,
      actor,
    );
    return c.json({ code: 0, message: "", data: appointment });
  },
);

appointmentController.post(
  "/:id/cancel",
  authGuard(["patient"]),
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    const appointment = await appointmentService.cancelOneById(id, actor);
    return c.json({ code: 0, message: "", data: appointment });
  },
);
