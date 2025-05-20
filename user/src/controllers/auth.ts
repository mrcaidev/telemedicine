import { emailSchema, otpSchema, passwordSchema } from "@/common/schema";
import { rbac } from "@/middleware/rbac";
import { validator } from "@/middleware/validator";
import * as authService from "@/services/auth";
import { Hono } from "hono";
import * as v from "valibot";

export const authController = new Hono();

authController.get("/me", rbac(), async (c) => {
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

authController.post("/logout", rbac(), async (c) => {
  const actor = c.get("actor");
  await authService.logOut(actor);
  return c.json({ code: 0, message: "", data: null });
});

authController.put(
  "/me/email",
  rbac(),
  validator("json", v.object({ email: emailSchema, otp: otpSchema })),
  async (c) => {
    const actor = c.get("actor");
    const data = c.req.valid("json");
    await authService.updateEmail(data, actor);
    return c.json({ code: 0, message: "", data: null });
  },
);

authController.put(
  "/me/password",
  rbac(),
  validator(
    "json",
    v.object({ oldPassword: passwordSchema, newPassword: passwordSchema }),
  ),
  async (c) => {
    const actor = c.get("actor");
    const data = c.req.valid("json");
    await authService.updatePassword(data, actor);
    return c.json({ code: 0, message: "", data: null });
  },
);

authController.post(
  "reset-password",
  validator(
    "json",
    v.object({ email: emailSchema, password: passwordSchema, otp: otpSchema }),
  ),
  async (c) => {
    const data = c.req.valid("json");
    await authService.resetPassword(data);
    return c.json({ code: 0, message: "", data: null });
  },
);
