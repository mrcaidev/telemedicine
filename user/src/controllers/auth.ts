import { emailSchema, passwordSchema } from "@/common/schema";
import { authGuard } from "@/middleware/auth-guard";
import { validator } from "@/middleware/validator";
import * as authService from "@/services/auth";
import { Hono } from "hono";
import * as v from "valibot";

export const authController = new Hono();

authController.get("/me", authGuard(), async (c) => {
  const actor = c.get("actor");
  const user = await authService.findCurrentUser(actor);
  return c.json({ code: 0, message: "", data: user });
});

authController.post(
  "/login",
  validator("json", v.object({ email: emailSchema, password: passwordSchema })),
  async (c) => {
    const { email, password } = c.req.valid("json");
    const userWithToken = await authService.logInWithEmailAndPassword(
      email,
      password,
    );
    return c.json({ code: 0, message: "", data: userWithToken }, 201);
  },
);
