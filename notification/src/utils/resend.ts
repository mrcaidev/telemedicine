import { Resend } from "resend";

export const resend = new Resend(Bun.env.RESEND_API_KEY);
