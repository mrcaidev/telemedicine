import { SHOULD_REALLY_SEND, resend } from "@/utils/resend";
import type { Email } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function schedule(email: Email, scheduledAt: string) {
  if (!SHOULD_REALLY_SEND) {
    const mockId = crypto.randomUUID();
    console.log(
      `scheduled email ${mockId} at ${scheduledAt}:`,
      JSON.stringify(email),
    );
    return mockId;
  }

  const { data, error } = await resend.emails.send({
    subject: email.subject,
    from: "Telemedicine <notification@telemedicine.ink>",
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    text: email.content,
    scheduledAt,
  });

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }

  return data!.id;
}

export async function reschedule(id: string, scheduledAt: string) {
  if (!SHOULD_REALLY_SEND) {
    console.log(`rescheduled email ${id} at ${scheduledAt}`);
    return;
  }

  const { error } = await resend.emails.update({ id, scheduledAt });

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }
}

export async function cancel(id: string) {
  if (!SHOULD_REALLY_SEND) {
    console.log(`cancelled email ${id}`);
    return;
  }

  const { error } = await resend.emails.cancel(id);

  if (error) {
    throw new HTTPException(502, { message: error.message });
  }
}
