declare module "bun" {
  interface Env {
    JWT_SECRET: string;
    POSTGRES_URL: string;
    KAFKA_BROKERS: string;
  }
}
