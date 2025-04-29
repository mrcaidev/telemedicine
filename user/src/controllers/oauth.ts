import { validator } from "@/middleware/validator";
import * as oauthService from "@/services/oauth";
import { Hono } from "hono";
import * as v from "valibot";

export const oauthController = new Hono();

oauthController.post(
  "/google/login",
  validator("json", v.object({ idToken: v.string() })),
  async (c) => {
    const { idToken } = c.req.valid("json");
    const patientWithToken = await oauthService.logInWithGoogle(idToken);
    return c.json({ code: 0, message: "", data: patientWithToken });
  },
);
