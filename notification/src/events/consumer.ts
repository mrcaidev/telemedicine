import { SHOULD_ACTUALLY_SEND, resend } from "@/utils/resend";
import type { Email } from "@/utils/types";
import { consumer } from "./kafka";

// 订阅主题。
await consumer.subscribe({ topics: ["EmailRequested"] });
console.log("kafka consumer subscribed to topics");

// 不断消费消息。
await consumer.run({
  eachMessage: async ({ topic, message }) => {
    const text = message.value?.toString();
    if (!text) {
      return;
    }

    const json = JSON.parse(text);
    if (!json) {
      return;
    }

    if (topic === "EmailRequested") {
      await consumeEmailRequestedEvent(json);
    }
  },
});
console.log("kafka consumer is running");

type EmailRequestedEvent = Email;

async function consumeEmailRequestedEvent(event: EmailRequestedEvent) {
  if (!SHOULD_ACTUALLY_SEND) {
    console.log("sent email:", JSON.stringify(event));
    return;
  }

  const { data, error } = await resend.emails.send({
    subject: event.subject,
    from: "Telemedicine <notification@telemedicine.ink>",
    to: event.to,
    cc: event.cc,
    bcc: event.bcc,
    text: event.content,
  });

  if (error) {
    console.error("failed to send email:", error.message);
    return;
  }

  console.log("sent email:", data!.id);
}
