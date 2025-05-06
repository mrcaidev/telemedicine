import {
  emailSchema,
  firstNameSchema,
  idSchema,
  lastNameSchema,
  passwordSchema,
} from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as doctorService from "@/services/doctor";
import { Hono } from "hono";
import * as v from "valibot";

export const doctorController = new Hono();

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
  validator("param", v.object({ id: idSchema })),
  async (c) => {
    const { id } = c.req.valid("param");
    const doctor = await doctorService.findOneById(id);
    return c.json({ code: 0, message: "", data: doctor });
  },
);

doctorController.post(
  "/",
  authGuard(["clinic_admin"]),
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
    const doctor = await doctorService.createOne(data, actor);
    return c.json({ code: 0, message: "", data: doctor }, 201);
  },
);
