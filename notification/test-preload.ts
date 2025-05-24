import { afterAll, mock } from "bun:test";

mock.module("resend", () => ({
  Resend: class {
    emails = {
      send: async () => {},
      update: async () => {},
      cancel: async () => {},
    };
  },
}));

if (Bun.env.UNIT_TEST) {
  mock.module("kafkajs", () => ({
    Kafka: class {
      producer() {
        return {
          connect: async () => {},
          disconnect: async () => {},
        };
      }
      consumer() {
        return {
          connect: async () => {},
          disconnect: async () => {},
          subscribe: async () => {},
          run: async () => {},
        };
      }
    },
    logLevel: {
      ERROR: 1,
    },
  }));
}

if (Bun.env.INTEGRATION_TEST) {
  afterAll(async () => {
    const { producer, consumer } = await import("@/events/kafka");
    await producer.disconnect();
    console.log("kafka producer disconnected");
    await consumer.disconnect();
    console.log("kafka consumer disconnected");
  });
}
