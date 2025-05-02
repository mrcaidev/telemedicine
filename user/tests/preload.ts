import { afterAll } from "bun:test";
import { producer } from "@/events/kafka";

afterAll(async () => {
  await producer.disconnect();
  console.log("kafka producer disconnected");
});
