import {
  bccSchema,
  ccSchema,
  contentSchema,
  idSchema,
  scheduledAtSchema,
  subjectSchema,
  toSchema,
} from "@/common/schemas";
import { validator } from "@/middleware/validator";
import * as scheduledEmailService from "@/services/scheduled-email";
import { Hono } from "hono";
import * as v from "valibot";

export const scheduledEmailController = new Hono();

scheduledEmailController.post(
  "/",
  validator(
    "json",
    v.object({
      subject: subjectSchema,
      to: toSchema,
      cc: ccSchema,
      bcc: bccSchema,
      content: contentSchema,
      scheduledAt: scheduledAtSchema,
    }),
  ),
  async (c) => {
    const { scheduledAt, ...email } = c.req.valid("json");
    const id = await scheduledEmailService.schedule(email, scheduledAt);
    return c.json({ code: 0, message: "", data: id }, 201);
  },
);

scheduledEmailController.patch(
  "/:id",
  validator("param", v.object({ id: idSchema })),
  validator("json", v.object({ scheduledAt: scheduledAtSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const { scheduledAt } = c.req.valid("json");
    await scheduledEmailService.reschedule(id, scheduledAt);
    return c.json({ code: 0, message: "", data: null });
  },
);

scheduledEmailController.delete(
  "/:id",
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    await scheduledEmailService.cancel(id);
    return c.json({ code: 0, message: "", data: null });
  },
);
