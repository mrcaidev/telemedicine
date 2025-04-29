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
      subject: v.string("subject should be a string"),
      to: v.array(v.string(), "to should be an array of strings"),
      cc: v.array(v.string(), "cc should be an array of strings"),
      bcc: v.array(v.string(), "bcc should be an array of strings"),
      content: v.string("content should be a string"),
      scheduledAt: v.pipe(
        v.string("scheduledAt should be an ISO 8601 timestamp"),
        v.isoTimestamp("scheduledAt should be an ISO 8601 timestamp"),
      ),
    }),
  ),
  async (c) => {
    const { scheduledAt, ...email } = c.req.valid("json");
    const id = await scheduledEmailService.schedule(email, scheduledAt);
    return c.json({ code: 0, message: "", data: id }, 201);
  },
);

scheduledEmailController.post(
  "/:id/reschedule",
  validator(
    "param",
    v.object({
      id: v.pipe(
        v.string("id should be a uuid"),
        v.uuid("id should be a uuid"),
      ),
    }),
  ),
  validator(
    "json",
    v.object({
      scheduledAt: v.pipe(
        v.string("scheduledAt should be an ISO 8601 timestamp"),
        v.isoTimestamp("scheduledAt should be an ISO 8601 timestamp"),
      ),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const { scheduledAt } = c.req.valid("json");
    await scheduledEmailService.reschedule(id, scheduledAt);
    return c.json({ code: 0, message: "", data: null });
  },
);

scheduledEmailController.post(
  "/:id/cancel",
  validator(
    "param",
    v.object({
      id: v.pipe(
        v.string("id should be a uuid"),
        v.uuid("id should be a uuid"),
      ),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    await scheduledEmailService.cancel(id);
    return c.json({ code: 0, message: "", data: null });
  },
);
