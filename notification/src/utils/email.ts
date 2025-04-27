import { Resend } from "resend";

type Email = {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
  scheduledAt: string | null;
};

const resend = new Resend(Bun.env.RESEND_API_KEY);

export async function sendEmail(email: Email) {
  if (Bun.env.NODE_ENV !== "production") {
    console.log("skip sending email in non-production environment");
    console.log("email:", JSON.stringify(email));
    return;
  }

  const { data, error } = await resend.emails.send({
    from: "Telemedicine <notification@telemedicine.ink>",
    to: email.to,
    cc: email.cc,
    bcc: email.bcc,
    subject: email.subject,
    text: email.content,
    ...(email.scheduledAt ? { scheduledAt: email.scheduledAt } : {}),
  });

  if (error) {
    console.error("failed to send email:", error);
    return;
  }

  console.log("sent email:", data?.id);
}
