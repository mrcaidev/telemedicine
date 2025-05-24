import { resend } from "@/utils/resend";
import type { Email } from "@/utils/types";

type EmailRequestedEvent = Email;

export async function consumeEmailRequestedEvent(event: EmailRequestedEvent) {
  const { data, error } = await resend.emails.send({
    from: "Telemedicine <notification@telemedicine.ink>",
    subject: event.subject,
    to: event.to,
    cc: event.cc,
    bcc: event.bcc,
    text: event.content,
  });

  if (error) {
    console.error(`failed to send email: ${error.message}`);
    return;
  }

  console.log(`sent email ${data!.id}`);
}
