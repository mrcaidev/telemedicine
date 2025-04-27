import { producer } from "./kafka";

type EmailRequestedEvent = {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
  scheduledAt: string | null;
};

export async function sendEmailRequestedEvent(event: EmailRequestedEvent) {
  const [record] = await producer.send({
    topic: "EmailRequested",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent EmailRequestedEvent:", JSON.stringify(record));
}
