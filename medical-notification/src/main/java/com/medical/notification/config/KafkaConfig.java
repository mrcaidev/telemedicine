package com.medical.notification.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Kafka配置类
 */
@Configuration
public class KafkaConfig {

    @Value("${notification.kafka.topics.appointment-created}")
    private String appointmentCreatedTopic;

    @Value("${notification.kafka.topics.appointment-rescheduled}")
    private String appointmentRescheduledTopic;

    @Value("${notification.kafka.topics.appointment-cancelled}")
    private String appointmentCancelledTopic;

    public String getAppointmentCreatedTopic() {
        return appointmentCreatedTopic;
    }

    public String getAppointmentRescheduledTopic() {
        return appointmentRescheduledTopic;
    }

    public String getAppointmentCancelledTopic() {
        return appointmentCancelledTopic;
    }
} 