declare module "bun" {
  interface Env {
    KAFKA_BROKERS: string;
  }
}
