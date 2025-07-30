package com.medical.record.config;


import com.medical.record.model.dto.MedicalRecordCreatedEvent;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.KafkaTestUtils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;


/**
 * ClassName:KafkaConfigTest
 * Package:com.medical.record.config
 * Description:
 *
 * @Author runge
 * @Create 2025/7/30 13:19
 * @Version 1.0
 */

@EmbeddedKafka(partitions = 1, topics = {"MedicalRecordCreated"})
public class KafkaConfigTest {

    private static final String MEDICAL_RECORD_CREATED_TOPIC = "MedicalRecordCreated";
    private KafkaTemplate<String, MedicalRecordCreatedEvent> kafkaTemplate;
    private Consumer<String, MedicalRecordCreatedEvent> consumer;

    @BeforeEach
    void setUp(EmbeddedKafkaBroker embeddedKafkaBroker) {
        // 手动配置Kafka生产者工厂
        Map<String, Object> producerProps = new HashMap<>();
        producerProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, embeddedKafkaBroker.getBrokersAsString());
        producerProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        producerProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        producerProps.put(ProducerConfig.ACKS_CONFIG, "all");
        producerProps.put(ProducerConfig.RETRIES_CONFIG, 1);

        // 创建KafkaTemplate实例
        DefaultKafkaProducerFactory<String, MedicalRecordCreatedEvent> producerFactory =
                new DefaultKafkaProducerFactory<>(producerProps);
        kafkaTemplate = new KafkaTemplate<>(producerFactory);

        // 配置消费者
        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps(
                "test-group", "true", embeddedKafkaBroker);
        consumerProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        consumerProps.put(JsonDeserializer.VALUE_DEFAULT_TYPE,
                "com.medical.record.model.dto.MedicalRecordCreatedEvent");

        // 创建消费者并订阅主题
        DefaultKafkaConsumerFactory<String, MedicalRecordCreatedEvent> consumerFactory =
                new DefaultKafkaConsumerFactory<>(
                        consumerProps,
                        new StringDeserializer(),
                        new JsonDeserializer<>(MedicalRecordCreatedEvent.class)
                );
        consumer = consumerFactory.createConsumer();
        embeddedKafkaBroker.consumeFromAnEmbeddedTopic(consumer, MEDICAL_RECORD_CREATED_TOPIC);
    }

    @AfterEach
    void tearDown() {
        if (consumer != null) {
            consumer.close();
        }
    }

    @Test
    void testSendMedicalRecordCreatedEvent() throws Exception {
        // 准备测试数据
        String recordId = UUID.randomUUID().toString();
        String appointmentId = "APP-" + System.currentTimeMillis();
        LocalDateTime eventTime = LocalDateTime.now();

        // 构建事件
        MedicalRecordCreatedEvent event = new MedicalRecordCreatedEvent(
                recordId,
                appointmentId,
                eventTime
        );

        // 发送消息
        kafkaTemplate.send(MEDICAL_RECORD_CREATED_TOPIC, event);
        //.get(10, TimeUnit.SECONDS);

        // 接收并验证消息
        ConsumerRecords<String, MedicalRecordCreatedEvent> records =
                KafkaTestUtils.getRecords(consumer, Duration.ofSeconds(10));

        assertThat(records.count()).isEqualTo(1);

        records.forEach(record -> {
            assertThat(record.value().getRecordId()).isEqualTo(recordId);
            assertThat(record.value().getAppointmentId()).isEqualTo(appointmentId);
            assertThat(record.value().getCreateTime()).isNotNull();
        });
    }
}

