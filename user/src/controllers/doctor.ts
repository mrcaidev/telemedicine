import {
  emailSchema,
  firstNameSchema,
  genderSchema,
  lastNameSchema,
  passwordSchema,
  uuidSchema,
} from "@/common/schema";
import { rbac } from "@/middleware/rbac";
import { validator } from "@/middleware/validator";
import * as doctorService from "@/services/doctor";
import { Hono } from "hono";
import * as v from "valibot";

export const doctorController = new Hono();

doctorController.get(
  "/",
  validator(
    "query",
    v.object({
      clinicId: v.optional(uuidSchema),
      sortBy: v.optional(
        v.union([v.literal("createdAt")], "sortBy should be 'createdAt'"),
        "createdAt",
      ),
      sortOrder: v.optional(
        v.union(
          [v.literal("asc"), v.literal("desc")],
          "sortOrder should be either 'asc' or 'desc'",
        ),
        "desc",
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
      ),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const page = await doctorService.paginate(query);
    return c.json({ code: 0, message: "", data: page });
  },
);

doctorController.get(
  "/random",
  validator(
    "query",
    v.object({
      limit: v.optional(
        v.pipe(
          v.string(),
          v.transform(Number),
          v.number("limit should be an integer between 1 and 100"),
          v.integer("limit should be an integer between 1 and 100"),
          v.minValue(1, "limit should be an integer between 1 and 100"),
          v.maxValue(100, "limit should be an integer between 1 and 100"),
        ),
        "3",
      ),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const doctors = await doctorService.sample(query);
    return c.json({ code: 0, message: "", data: doctors });
  },
);

doctorController.get(
  "/search",
  validator(
    "query",
    v.object({
      q: v.pipe(
        v.string(),
        v.minLength(1, "q should be between 1-50 characters"),
        v.maxLength(50, "q should be between 1-50 characters"),
      ),
      limit: v.optional(
        v.pipe(
          v.string(),
          v.transform(Number),
          v.number("limit should be an integer between 1-30"),
          v.integer("limit should be an integer between 1-30"),
          v.minValue(1, "limit should be an integer between 1-30"),
          v.maxValue(30, "limit should be an integer between 1-30"),
        ),
        "10",
      ),
      cursor: v.optional(
        v.pipe(
          v.string(),
          v.transform(Number),
          v.number("cursor should be a number between 0-1"),
          v.minValue(0, "cursor should be a number between 0-1"),
          v.maxValue(1, "cursor should be a number between 0-1"),
        ),
        "1",
      ),
    }),
  ),
  async (c) => {
    const query = c.req.valid("query");
    const page = await doctorService.search(query);
    return c.json({ code: 0, message: "", data: page });
  },
);

doctorController.get(
  "/:id",
  validator("param", v.object({ id: uuidSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const doctor = await doctorService.findById(id);
    return c.json({ code: 0, message: "", data: doctor });
  },
);

doctorController.post(
  "/",
  rbac(["clinic_admin"]),
  validator(
    "json",
    v.object({
      email: emailSchema,
      password: passwordSchema,
      firstName: firstNameSchema,
      lastName: lastNameSchema,
    }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const doctor = await doctorService.create(data, actor);
    return c.json({ code: 0, message: "", data: doctor }, 201);
  },
);

doctorController.patch(
  "/:id",
  rbac(["clinic_admin"]),
  validator("param", v.object({ id: uuidSchema })),
  validator(
    "json",
    v.object({
      firstName: v.optional(firstNameSchema),
      lastName: v.optional(lastNameSchema),
      description: v.optional(v.string()),
      gender: v.optional(genderSchema),
      specialties: v.optional(v.array(v.string())),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const actor = c.get("actor");
    const doctor = await doctorService.updateById(id, data, actor);
    return c.json({ code: 0, message: "", data: doctor });
  },
);

doctorController.delete(
  "/:id",
  rbac(["clinic_admin"]),
  validator("param", v.object({ id: uuidSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const actor = c.get("actor");
    await doctorService.deleteById(id, actor);
    return c.json({ code: 0, message: "", data: null });
  },
);
