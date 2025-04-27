declare module "bun" {
  interface Env {
    RESEND_API_KEY: string;
    KAFKA_BROKERS: string;
  }
}
