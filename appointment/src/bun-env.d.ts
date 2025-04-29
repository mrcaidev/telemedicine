declare module "bun" {
  interface Env {
    POSTGRES_URL: string;
    KAFKA_BROKERS: string;
  }
}
