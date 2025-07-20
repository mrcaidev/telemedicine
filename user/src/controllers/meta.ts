import { rbac } from "@/middleware/rbac";
import * as metaService from "@/services/meta";
import { Hono } from "hono";

export const metaController = new Hono();

metaController.get("/totals", rbac(["platform_admin"]), async (c) => {
  const totals = await metaService.findTotals();
  return c.json({ code: 0, message: "", data: totals });
});

metaController.get("/trends", rbac(["platform_admin"]), async (c) => {
  const trends = await metaService.findTrends();
  return c.json({ code: 0, message: "", data: { platformtrends: trends } });
});

metaController.get("/clinic-ranks", rbac(["platform_admin"]), async (c) => {
  const clinicRanks = await metaService.rankClinics();
  return c.json({ code: 0, message: "", data: { ranks: clinicRanks } });
});
