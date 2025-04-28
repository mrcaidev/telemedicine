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
          "Unsupported sortBy value",
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
          v.number("Limit should be a integer between 1 and 100"),
          v.integer("Limit should be a integer between 1 and 100"),
          v.minValue(1, "Limit should be a integer between 1 and 100"),
          v.maxValue(100, "Limit should be a integer between 1 and 100"),
        ),
        "10",
      ),
      cursor: v.optional(
        v.nullable(
          v.pipe(
            v.string(),
            v.isoTimestamp("Cursor should be a valid ISO timestamp"),
          ),
        ),
        null,
      ),
    }),
  ),
  async (c) => {
    const options = c.req.valid("query");
    const user = { id: c.get("userId"), role: c.get("userRole") };
    const page = await appointmentService.findAll(options, user);
    return c.json({ code: 0, message: "", data: page });
  },
);
