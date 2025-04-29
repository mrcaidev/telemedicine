declare module "bun" {
  interface Env {
    JWT_SECRET: string;
    SUPER_ADMIN_TOKEN: string;
    POSTGRES_URL: string;
    KAFKA_BROKERS: string;
    GOOGLE_WEB_CLIENT_ID: string;
    GOOGLE_ANDROID_CLIENT_ID: string;
    GOOGLE_IOS_CLIENT_ID: string;
  }
}
