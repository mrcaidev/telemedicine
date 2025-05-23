import { afterAll, mock } from "bun:test";
import { consumer, producer } from "@/events/kafka";

mock.module("resend", () => ({
  Resend: class {
    emails = {
      send: async () => {},
      update: async () => {},
      cancel: async () => {},
    };
  },
}));

afterAll(async () => {
  await producer.disconnect();
  console.log("kafka producer disconnected");
  await consumer.disconnect();
  console.log("kafka consumer disconnected");
});
