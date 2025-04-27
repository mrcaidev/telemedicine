import { validator } from "@/middleware/validator";
import * as platformAdminService from "@/services/platform-admin";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import * as v from "valibot";

export const platformAdminController = new Hono();

platformAdminController.post(
  "/",
  bearerAuth({ token: Bun.env.SUPER_ADMIN_TOKEN }),
  validator(
    "json",
    v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
      password: v.pipe(
        v.string(),
        v.minLength(
          8,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
        v.maxLength(
          20,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
        v.regex(
          /[A-Za-z]/,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
        v.regex(
          /\d/,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
        v.regex(
          /[`~!@#$%^&*()\-_=+\[{\]}\\|;:'",<.>\/?]/,
          "Password should be 8-20 characters long, with at least one letter, one digit and one special character",
        ),
      ),
    }),
  ),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const platformAdmin = await platformAdminService.createPlatformAdmin({
      email,
      password,
    });
    return c.json({ code: 0, message: "", data: platformAdmin }, 201);
  },
);
