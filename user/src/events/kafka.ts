import { Kafka, logLevel } from "kafkajs";

// 初始化 Kafka 客户端。
const kafka = new Kafka({
  clientId: "user",
  brokers: Bun.env.KAFKA_BROKERS.split(","),
  logLevel: logLevel.ERROR,
});
console.log("initialized kafka client");

// 确保所有相关主题存在。
const admin = kafka.admin();
await admin.connect();
console.log("connected to kafka as admin");

const topicsCreated = await admin.createTopics({
  topics: [
    {
      topic: "EmailRequested",
      numPartitions: 3,
      replicationFactor: 2,
    },
  ],
});

if (topicsCreated) {
  console.log("created topics");
} else {
  console.log("topics already exist");
}

await admin.disconnect();
console.log("disconnected from kafka as admin");

// 初始化 Kafka 生产者。
export const producer = kafka.producer();
await producer.connect();
console.log("connected to kafka as producer");

// 优雅处理错误。
for (const errorType of ["unhandledRejection", "uncaughtException"]) {
  process.on(errorType, async (error) => {
    console.error(error);
    try {
      await producer.disconnect();
      console.log("disconnected from kafka as producer");
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
      console.log("disconnected from kafka as producer");
    } finally {
      process.kill(process.pid, signal);
    }
  });
}
