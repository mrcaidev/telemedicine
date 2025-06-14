import { SENDER_ADDRESS } from "@/common/constants";
import { resend } from "@/utils/resend";
import type { Email } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function schedule(email: Email, scheduledAt: string) {
  const { data, error } = await resend.emails.send({
    from: SENDER_ADDRESS,
    subject: email.subject,
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    text: email.content,
    scheduledAt,
  });

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }

  console.log(`scheduled email ${data!.id} at ${scheduledAt}`);

  return data!.id;
}

export async function reschedule(id: string, scheduledAt: string) {
  const { error } = await resend.emails.update({ id, scheduledAt });

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }

  console.log(`rescheduled email ${id} to ${scheduledAt}`);
}

export async function cancel(id: string) {
  const { error } = await resend.emails.cancel(id);

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }

  console.log(`cancelled email ${id}`);
}
