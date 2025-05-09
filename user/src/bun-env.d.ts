declare module "bun" {
  interface Env {
    JWT_SECRET: string;
    SUPER_ADMIN_TOKEN: string;
    GOOGLE_OAUTH_CLIENT_IDS: string;
    POSTGRES_URL: string;
    KAFKA_BROKERS: string;
    KAFKA_SECURITY_PROTOCOL?: string;
    KAKFA_SASL_USERNAME?: string;
    KAFKA_SASL_PASSWORD?: string;
    KAFKA_SSL_CA?: string;
    KAFKA_SSL_KEY?: string;
    KAFKA_SSL_CERT?: string;
  }
}
