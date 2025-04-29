import { mock } from "bun:test";

mock.module("kafkajs", () => ({
  Kafka: class {
    consumer() {
      return {
        connect: () => {},
        disconnect: () => {},
        subscribe: () => {},
        run: () => {},
      };
    }
  },
  logLevel: {
    ERROR: 1,
  },
}));

mock.module("resend", () => ({
  Resend: class {
    emails = new (class {
      send() {}
      update() {}
      cancel() {}
    })();
  },
}));
