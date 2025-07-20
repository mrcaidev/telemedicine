import { metaTimeRangeSchema } from "@/common/schema";
import { rbac } from "@/middleware/rbac";
import { validator } from "@/middleware/validator";
import * as metaService from "@/services/meta";
import { Hono } from "hono";

export const metaController = new Hono();

metaController.get("/totals", rbac(["platform_admin"]), async (c) => {
  const totals = await metaService.findTotals();
  return c.json({ code: 0, message: "", data: totals });
});

metaController.get(
  "/trends",
  rbac(["platform_admin"]),
  validator("query", metaTimeRangeSchema),
  async (c) => {
    const timeRange = c.req.valid("query");
    const trends = await metaService.findTrends(timeRange);
    return c.json({ code: 0, message: "", data: { platformtrends: trends } });
  },
);

metaController.get("/clinic-ranks", rbac(["platform_admin"]), async (c) => {
  const clinicRanks = await metaService.rankClinics();
  return c.json({ code: 0, message: "", data: { ranks: clinicRanks } });
});
