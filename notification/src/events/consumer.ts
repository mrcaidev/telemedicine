import { sendEmail } from "@/utils/email";
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

type EmailRequestedEvent = {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
  scheduledAt: string | null;
};

async function consumeEmailRequestedEvent(event: EmailRequestedEvent) {
  await sendEmail(event);
}
