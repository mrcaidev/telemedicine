import { Kafka, type KafkaConfig, logLevel } from "kafkajs";
import {
  consumeAppointmentBookedEvent,
  consumeAppointmentCancelledEvent,
  consumeAppointmentRescheduledEvent,
  consumeDoctorCreatedEvent,
  consumeDoctorUpdatedEvent,
  consumePatientCreatedEvent,
  consumePatientUpdatedEvent,
} from "./consumer";

// 读取 Kafka 配置。
async function readConfig() {
  const baseConfig: KafkaConfig = {
    clientId: "notification",
    brokers: Bun.env.KAFKA_BROKERS?.split(","),
    logLevel: logLevel.ERROR,
  };

  const securityProtocol = Bun.env.KAFKA_SECURITY_PROTOCOL || "PLAINTEXT";

  if (securityProtocol === "PLAINTEXT") {
    console.log("kafka is using PLAINTEXT protocol");
    return baseConfig;
  }

  if (securityProtocol === "SASL_SSL") {
    console.log("kafka is using SASL_SSL protocol");

    if (
      !Bun.env.KAFKA_SASL_USERNAME ||
      !Bun.env.KAFKA_SASL_PASSWORD ||
      !Bun.env.KAFKA_SSL_CA
    ) {
      throw new Error(
        "kafka SASL_SSL protocol requires environment variables KAFKA_SASL_USERNAME, KAFKA_SASL_PASSWORD and KAFKA_SSL_CA",
      );
    }

    const ca = await Bun.file(Bun.env.KAFKA_SSL_CA).text();

    return {
      ...baseConfig,
      sasl: {
        mechanism: "plain",
        username: Bun.env.KAFKA_SASL_USERNAME,
        password: Bun.env.KAFKA_SASL_PASSWORD,
      },
      ssl: { ca },
    } satisfies KafkaConfig;
  }

  if (securityProtocol === "SSL") {
    console.log("kafka is using SSL protocol");

    if (
      !Bun.env.KAFKA_SSL_CA ||
      !Bun.env.KAFKA_SSL_KEY ||
      !Bun.env.KAFKA_SSL_CERT
    ) {
      throw new Error(
        "kafka SSL protocol requires environment variables KAFKA_SSL_CA, KAFKA_SSL_KEY and KAFKA_SSL_CERT",
      );
    }

    const [ca, key, cert] = await Promise.all([
      Bun.file(Bun.env.KAFKA_SSL_CA).text(),
      Bun.file(Bun.env.KAFKA_SSL_KEY).text(),
      Bun.file(Bun.env.KAFKA_SSL_CERT).text(),
    ]);

    return {
      ...baseConfig,
      ssl: { ca, key, cert, rejectUnauthorized: false },
    } satisfies KafkaConfig;
  }

  throw new Error(
    `kafka ${securityProtocol} protocol is not supported. Supported protocols are PLAINTEXT, SASL_SSL and SSL`,
  );
}
const config = await readConfig();

// 初始化 Kafka 客户端。
const kafka = new Kafka(config);
console.log("kafka client initialized");

// 连接生产者。
export const producer = kafka.producer();
await producer.connect();
console.log("kafka producer connected");

// 连接消费者。
export const consumer = kafka.consumer({ groupId: "notification" });
await consumer.connect();
console.log("kafka consumer connected");

// 消费者订阅主题。
await consumer.subscribe({
  topics: [
    "PatientCreated",
    "PatientUpdated",
    "DoctorCreated",
    "DoctorUpdated",
    "AppointmentBooked",
    "AppointmentRescheduled",
    "AppointmentCancelled",
  ],
});
console.log("kafka consumer subscribed to topics");

// 启动消费者。
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
    if (topic === "PatientCreated") {
      await consumePatientCreatedEvent(json);
    } else if (topic === "PatientUpdated") {
      await consumePatientUpdatedEvent(json);
    } else if (topic === "DoctorCreated") {
      await consumeDoctorCreatedEvent(json);
    } else if (topic === "DoctorUpdated") {
      await consumeDoctorUpdatedEvent(json);
    } else if (topic === "AppointmentBooked") {
      await consumeAppointmentBookedEvent(json);
    } else if (topic === "AppointmentRescheduled") {
      await consumeAppointmentRescheduledEvent(json);
    } else if (topic === "AppointmentCancelled") {
      await consumeAppointmentCancelledEvent(json);
    }
  },
});
console.log("kafka consumer is running");

// 优雅处理错误。
for (const errorType of ["unhandledRejection", "uncaughtException"]) {
  process.on(errorType, async (error) => {
    console.error(error);
    try {
      await producer.disconnect();
      console.log("kafka producer disconnected");
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
      await producer.disconnect();
      console.log("kafka producer disconnected");
      await consumer.disconnect();
      console.log("kafka consumer disconnected");
    } finally {
      process.kill(process.pid, signal);
    }
  });
}
