import { rbac } from "@/middleware/rbac";
import { validator } from "@/middleware/validator";
import * as doctorAvailabilityService from "@/services/doctor-availability";
import { Hono } from "hono";
import * as v from "valibot";

export const doctorAvailabilityController = new Hono();

doctorAvailabilityController.get(
  "/:doctorId",
  validator("param", v.object({ doctorId: v.pipe(v.string(), v.uuid()) })),
  async (c) => {
    const { doctorId } = c.req.valid("param");
    const doctorAvailabilities =
      await doctorAvailabilityService.findAllByDoctorId(doctorId);
    return c.json({ code: 0, message: "", data: doctorAvailabilities });
  },
);

doctorAvailabilityController.post(
  "/:doctorId",
  rbac(["clinic_admin"]),
  validator("param", v.object({ doctorId: v.pipe(v.string(), v.uuid()) })),
  validator(
    "json",
    v.object({
      weekday: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(6)),
      startTime: v.pipe(v.string(), v.isoTime()),
      endTime: v.pipe(v.string(), v.isoTime()),
    }),
  ),
  async (c) => {
    const { doctorId } = c.req.valid("param");
    const data = c.req.valid("json");
    const doctorAvailability = await doctorAvailabilityService.createOne({
      doctorId,
      ...data,
    });
    return c.json({ code: 0, message: "", data: doctorAvailability }, 201);
  },
);
