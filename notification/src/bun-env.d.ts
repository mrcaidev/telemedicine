declare module "bun" {
  interface Env {
    RESEND_API_KEY: string;
    KAFKA_BROKERS: string;
    KAFKA_SECURITY_PROTOCOL?: string;
    KAKFA_SASL_USERNAME?: string;
    KAFKA_SASL_PASSWORD?: string;
    KAFKA_SSL_CA?: string;
    KAFKA_SSL_KEY?: string;
    KAFKA_SSL_CERT?: string;
  }
}
