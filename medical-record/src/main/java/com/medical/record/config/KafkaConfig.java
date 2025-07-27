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
        configProps.put("security.protocol", "SSL");
// Truststore (CA)
        configProps.put(SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG, "PEM");
        configProps.put(SslConfigs.SSL_TRUSTSTORE_CERTIFICATES_CONFIG, "/etc/kafka/certs/ca.crt");

// Keystore (client cert + key)
        configProps.put(SslConfigs.SSL_KEYSTORE_TYPE_CONFIG, "PEM");
        configProps.put(SslConfigs.SSL_KEYSTORE_CERTIFICATE_CHAIN_CONFIG, "/etc/kafka/certs/client.crt");
        configProps.put(SslConfigs.SSL_KEYSTORE_KEY_CONFIG, "/etc/kafka/certs/client.key");

        // 配置JsonSerializer以支持对象序列化
//        configProps.put(JsonSerializer.TYPE_MAPPINGS,
//                "medical-record-created-event:com.medical.record.model.dto.MedicalRecordCreatedEvent");
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
