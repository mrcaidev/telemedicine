import { Kafka, logLevel } from "kafkajs";

// 初始化 Kafka 客户端。
const kafka = new Kafka({
  clientId: "user",
  brokers: Bun.env.KAFKA_BROKERS.split(","),
  logLevel: logLevel.ERROR,
});
console.log("kafka client initialized");

// 初始化生产者。
export const producer = kafka.producer();
await producer.connect();
console.log("kafka producer connected");

// 优雅处理错误。
for (const errorType of ["unhandledRejection", "uncaughtException"]) {
  process.on(errorType, async (error) => {
    console.error(error);
    try {
      await producer.disconnect();
      console.log("kafka producer disconnected");
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
      await producer.disconnect();
      console.log("kafka producer disconnected");
    } finally {
      process.kill(process.pid, signal);
    }
  });
}
