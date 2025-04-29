import { Kafka, logLevel } from "kafkajs";

// 初始化 Kafka 客户端。
const kafka = new Kafka({
  clientId: "notification",
  brokers: Bun.env.KAFKA_BROKERS.split(","),
  logLevel: logLevel.ERROR,
});
console.log("kafka client initialized");

// 初始化 Kafka 消费者。
export const consumer = kafka.consumer({ groupId: "notification" });
await consumer.connect();
console.log("kafka consumer connected");

// 优雅处理错误。
for (const errorType of ["unhandledRejection", "uncaughtException"]) {
  process.on(errorType, async (error) => {
    console.error(error);
    try {
      await consumer.disconnect();
      console.log("kafka consumer disconnected");
      process.exit(0);
    } catch {
      process.exit(1);
    }
  });
}

// 优雅处理信号。
for (const signal of ["SIGTERM", "SIGINT", "SIGUSR2"]) {
  process.once(signal, async () => {
    try {
      await consumer.disconnect();
      console.log("kafka consumer disconnected");
    } finally {
      process.kill(process.pid, signal);
    }
  });
}
