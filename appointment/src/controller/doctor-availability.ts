import { isoTimeSchema, uuidSchema, weekdaySchema } from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as doctorAvailabilityService from "@/services/doctor-availability";
import { Hono } from "hono";
import * as v from "valibot";

export const doctorAvailabilityController = new Hono();

doctorAvailabilityController.get(
  "/:doctorId",
  validator("param", v.object({ doctorId: uuidSchema })),
  async (c) => {
    const { doctorId } = c.req.valid("param");

    const doctorAvailabilities =
      await doctorAvailabilityService.findAllByDoctorId(doctorId);

    return c.json({ code: 0, message: "", data: doctorAvailabilities });
  },
);

doctorAvailabilityController.post(
  "/:doctorId",
  authGuard(["clinic_admin"]),
  validator("param", v.object({ doctorId: uuidSchema })),
  validator(
    "json",
    v.object({
      weekday: weekdaySchema,
      startTime: isoTimeSchema,
      endTime: isoTimeSchema,
    }),
  ),
  async (c) => {
    const { doctorId } = c.req.valid("param");
    const data = c.req.valid("json");
    const userId = c.get("userId");
    const doctorAvailability = await doctorAvailabilityService.createOne(
      { doctorId, ...data },
      userId,
    );
    return c.json({ code: 0, message: "", data: doctorAvailability }, 201);
  },
);
