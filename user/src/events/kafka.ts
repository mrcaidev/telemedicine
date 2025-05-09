import { Kafka, type KafkaConfig, logLevel } from "kafkajs";

async function readConfig() {
  const baseConfig: KafkaConfig = {
    clientId: "user",
    brokers: Bun.env.KAFKA_BROKERS.split(","),
    logLevel: logLevel.ERROR,
  };

  const protocol = Bun.env.KAFKA_SECURITY_PROTOCOL || "PLAINTEXT";

  if (protocol === "PLAINTEXT") {
    console.log("kafka is using PLAINTEXT protocol");
    return baseConfig;
  }

  if (protocol === "SASL_SSL") {
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
      ssl: { ca },
      sasl: {
        mechanism: "plain",
        username: Bun.env.KAFKA_SASL_USERNAME,
        password: Bun.env.KAFKA_SASL_PASSWORD,
      },
    } satisfies KafkaConfig;
  }

  if (protocol === "SSL") {
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
      ssl: {
        rejectUnauthorized: false,
        ca,
        key,
        cert,
      },
    } satisfies KafkaConfig;
  }

  throw new Error(
    `kafka ${protocol} protocol is not supported. Supported protocols are PLAINTEXT, SASL_SSL and SSL`,
  );
}
const config = await readConfig();

// 初始化 Kafka 客户端。
const kafka = new Kafka(config);
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
