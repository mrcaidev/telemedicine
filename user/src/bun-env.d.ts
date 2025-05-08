declare module "bun" {
  interface Env {
    JWT_SECRET: string;
    SUPER_ADMIN_TOKEN: string;
    POSTGRES_URL: string;
    KAFKA_BROKERS: string;
    GOOGLE_OAUTH_CLIENT_IDS: string;
  }
}
