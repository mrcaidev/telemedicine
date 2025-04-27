import { roleGuard } from "@/middleware/role-guard";
import { validator } from "@/middleware/validator";
import * as authService from "@/services/auth";
import { Hono } from "hono";
import * as v from "valibot";

export const authController = new Hono();

authController.get("/me", roleGuard(), async (c) => {
  const userId = c.get("userId");
  const user = await authService.getUserById(userId);
  return c.json({ code: 0, message: "", data: user });
});

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
    const userWithToken = await authService.logInWithEmailAndPassword(
      email,
      password,
    );
    return c.json({ code: 0, message: "", data: userWithToken }, 201);
  },
);
