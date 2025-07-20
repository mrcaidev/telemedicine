import { rbac } from "@/middleware/rbac";
import { validator } from "@/middleware/validator";
import * as metaService from "@/services/meta";
import { Hono } from "hono";
import * as v from "valibot";

export const metaController = new Hono();

metaController.get("/totals", rbac(["platform_admin"]), async (c) => {
  const totalAppointments = await metaService.countAppointments();
  return c.json({ code: 0, message: "", data: { totalAppointments } });
});

metaController.get(
  "/trends",
  rbac(["clinic_admin", "doctor"]),
  validator(
    "query",
    v.object({ clinicId: v.optional(v.pipe(v.string(), v.uuid())) }),
  ),
  async (c) => {
    const { clinicId = "" } = c.req.valid("query");
    const { id, role } = c.get("actor");

    if (role === "clinic_admin") {
      const trends = await metaService.findClinicAppointmentTrends(clinicId);
      return c.json({
        code: 0,
        message: "",
        data: { clinicAppointments: trends },
      });
    }

    const trends = await metaService.findDoctorAppointmentTrends(id);
    return c.json({
      code: 0,
      message: "",
      data: { appointmentsTrends: trends },
    });
  },
);

metaController.get(
  "/stats",
  rbac(["clinic_admin", "doctor"]),
  validator(
    "query",
    v.object({ clinicId: v.optional(v.pipe(v.string(), v.uuid())) }),
  ),
  async (c) => {
    const { clinicId = "" } = c.req.valid("query");
    const { id, role } = c.get("actor");

    if (role === "clinic_admin") {
      const stats = await metaService.findClinicStats(clinicId);
      return c.json({ code: 0, message: "", data: stats });
    }

    const stats = await metaService.findDoctorStats(id);
    return c.json({ code: 0, message: "", data: stats });
  },
);

metaController.get(
  "/per-doctor-month",
  rbac(["clinic_admin"]),
  validator("query", v.object({ clinicId: v.pipe(v.string(), v.uuid()) })),
  async (c) => {
    const { clinicId } = c.req.valid("query");
    const appointments =
      await metaService.findClinicAppointmentsGroupByDoctors(clinicId);
    return c.json({
      code: 0,
      message: "",
      data: { doctorAppointments: appointments },
    });
  },
);

metaController.get(
  "/doctor-ranks",
  rbac(["clinic_admin"]),
  validator("query", v.object({ clinicId: v.pipe(v.string(), v.uuid()) })),
  async (c) => {
    const { clinicId } = c.req.valid("query");
    const ranks = await metaService.rankDoctorsByAppointmentCount(clinicId);
    return c.json({ code: 0, message: "", data: { ranks } });
  },
);
