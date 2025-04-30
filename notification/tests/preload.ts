import { afterAll } from "bun:test";
import { consumer, producer } from "@/events/kafka";

afterAll(async () => {
  await producer.disconnect();
  console.log("kafka producer disconnected");
  await consumer.disconnect();
  console.log("kafka consumer disconnected");
});
