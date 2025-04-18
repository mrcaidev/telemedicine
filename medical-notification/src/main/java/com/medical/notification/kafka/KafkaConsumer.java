package com.medical.notification.kafka;

import com.medical.notification.service.MessageHandlerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * Kafka消费者
 */
@Slf4j
@Component
public class KafkaConsumer {

    @Autowired
    private MessageHandlerService messageHandlerService;

    /**
     * 监听预约创建消息
     */
    @KafkaListener(topics = "${notification.kafka.topics.appointment-created}")
    public void listenAppointmentCreated(String message) {
        log.info("收到预约创建消息: {}", message);
        messageHandlerService.handleAppointmentCreated(message);
    }

    /**
     * 监听预约重新安排消息
     */
    @KafkaListener(topics = "${notification.kafka.topics.appointment-rescheduled}")
    public void listenAppointmentRescheduled(String message) {
        log.info("收到预约重新安排消息: {}", message);
        messageHandlerService.handleAppointmentRescheduled(message);
    }

    /**
     * 监听预约取消消息
     */
    @KafkaListener(topics = "${notification.kafka.topics.appointment-cancelled}")
    public void listenAppointmentCancelled(String message) {
        log.info("收到预约取消消息: {}", message);
        messageHandlerService.handleAppointmentCancelled(message);
    }
} 