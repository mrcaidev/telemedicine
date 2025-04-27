import { validator } from "@/middleware/validator";
import * as authService from "@/services/auth";
import { Hono } from "hono";
import * as v from "valibot";

export const authController = new Hono();

authController.post(
  "/login",
  validator(
    "json",
    v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
      password: v.pipe(
        v.string(),
        v.minLength(8, "Password should be 8-20 characters long"),
        v.maxLength(20, "Password should be 8-20 characters long"),
      ),
    }),
  ),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const result = await authService.logInWithEmailAndPassword(email, password);
    return c.json({ code: 0, message: "", data: result }, 201);
  },
);
