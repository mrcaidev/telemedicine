import { resend } from "@/utils/resend";
import { consumer } from "./kafka";

// 订阅 EmailRequested 主题。
await consumer.subscribe({ topic: "EmailRequested" });
console.log("kafka consumer subscribed to EmailRequested topic");

// 不断消费消息。
await consumer.run({
  eachMessage: async ({ topic, message }) => {
    const text = message.value?.toString();
    if (!text) {
      return;
    }

    console.log("kafka consumer received message:", text);

    const json = JSON.parse(text);
    if (!json) {
      return;
    }

    // 处理 EmailRequested 事件。
    if (topic === "EmailRequested") {
      await consumeEmailRequestedEvent(json);
    }
  },
});
console.log("kafka consumer is running");

type EmailRequestedEvent = {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
  scheduledAt: string | null;
};

async function consumeEmailRequestedEvent(event: EmailRequestedEvent) {
  if (Bun.env.NODE_ENV !== "production") {
    console.log("skip sending email in non-production environment");
    console.log("email:", JSON.stringify(event));
    return;
  }

  const { data, error } = await resend.emails.send({
    from: "Telemedicine <notification@telemedicine.ink>",
    to: event.to,
    cc: event.cc,
    bcc: event.bcc,
    subject: event.subject,
    text: event.content,
    ...(event.scheduledAt ? { scheduledAt: event.scheduledAt } : {}),
  });

  if (error) {
    console.error("failed to send email:", error.message);
    return;
  }

  console.log("sent email:", data?.id);
}
