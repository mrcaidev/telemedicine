import { Resend } from "resend";

export const resend = new Resend(Bun.env.RESEND_API_KEY);

export const SHOULD_REALLY_SEND = Bun.env.RESEND_API_KEY.startsWith("re_");

if (!SHOULD_REALLY_SEND) {
  console.log("resend api key is invalid. emails will not be sent.");
}
