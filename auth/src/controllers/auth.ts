import { validator } from "@/middleware/validator";
import * as authService from "@/services/auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";

export const authController = new Hono();

authController.get("/me", async (c) => {
  const id = c.req.header("X-User-Id");
  if (!id) {
    throw new HTTPException(401, { message: "Please log in first" });
  }

  const result = await authService.getUserById(id);
  return c.json(result);
});

authController.post(
  "/login",
  validator(
    "json",
    v.object({
      email: v.pipe(v.string(), v.email("Invalid email")),
      password: v.pipe(
        v.string(),
        v.minLength(8, "Password should be at least 8 characters long"),
        v.maxLength(20, "Password should be at most 20 characters long"),
      ),
    }),
  ),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const result = await authService.loginWithEmailPassword(email, password);
    return c.json(result);
  },
);
