package com.medical.record.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.config.SslConfigs;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Kafka配置类
 */
@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put("bootstrap.servers", bootstrapServers);
        configProps.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        configProps.put("value.serializer", JsonSerializer.class);

        // SSL配置 - 使用PEM格式证书的正确配置方式
        configProps.put("security.protocol", "SSL");
        // 信任证书配置
        configProps.put(SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG, "PEM");
        configProps.put(SslConfigs.SSL_TRUSTSTORE_CERTIFICATES_CONFIG, readCertificateFile("/etc/kafka/certs/ca.crt"));
        // 客户端证书和私钥配置
        configProps.put(SslConfigs.SSL_KEYSTORE_TYPE_CONFIG, "PEM");
        configProps.put(SslConfigs.SSL_KEYSTORE_CERTIFICATE_CHAIN_CONFIG, readCertificateFile(("/etc/kafka/certs/client.crt")));
        configProps.put(SslConfigs.SSL_KEYSTORE_KEY_CONFIG, readCertificateFile("/etc/kafka/certs/client.key"));

        // 配置 JsonSerializer 以支持对象序列化
//        configProps.put(JsonSerializer.TYPE_MAPPINGS,
//                "medical-record-created-event:com.medical.record.model.dto.MedicalRecordCreatedEvent");
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    private String readCertificateFile(String filePath) {
        try {
            return Files.readString(Paths.get(filePath), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read certificate file: " + filePath, e);
        }
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
