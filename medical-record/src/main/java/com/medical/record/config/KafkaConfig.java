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

        // SSL配置 - 使用PEM格式证书的正确配置方式
        configProps.put("security.protocol", "SSL");
        // 信任证书配置
        configProps.put("ssl.truststore.type", "PEM");
        configProps.put("ssl.truststore.certificates", "/etc/kafka/certs/ca.crt");
        // 客户端证书和私钥配置
        configProps.put("ssl.keystore.type", "PKCS12");
        configProps.put("ssl.keystore.certificate.chain", "/etc/kafka/certs/client.crt");
        configProps.put("ssl.keystore.key", "/etc/kafka/certs/client.key");

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
