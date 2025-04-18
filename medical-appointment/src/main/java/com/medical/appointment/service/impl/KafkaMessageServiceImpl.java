package com.medical.appointment.service.impl;

import com.medical.appointment.service.KafkaMessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * Kafka消息服务实现类
 */
@Slf4j
@Service
public class KafkaMessageServiceImpl implements KafkaMessageService {

    @Resource
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendAppointmentCreatedMessage(String userId, String appointmentId, String title, String content) {
        Map<String, Object> message = new HashMap<>();
        message.put("userId", userId);
        message.put("appointmentId", appointmentId);
        message.put("title", title);
        message.put("content", content);
        message.put("type", "APPOINTMENT_CREATED");

        kafkaTemplate.send("appointment_created", message);
        log.info("发送预约创建消息: {}", message);
    }

    @Override
    public void sendAppointmentCancelledMessage(String userId, String appointmentId, String title, String content) {
        Map<String, Object> message = new HashMap<>();
        message.put("userId", userId);
        message.put("appointmentId", appointmentId);
        message.put("title", title);
        message.put("content", content);
        message.put("type", "APPOINTMENT_CANCELLED");

        kafkaTemplate.send("appointment_cancelled", message);
        log.info("发送预约取消消息: {}", message);
    }

    @Override
    public void sendAppointmentRescheduledMessage(String userId, String appointmentId, String title, String content) {
        Map<String, Object> message = new HashMap<>();
        message.put("userId", userId);
        message.put("appointmentId", appointmentId);
        message.put("title", title);
        message.put("content", content);
        message.put("type", "APPOINTMENT_RESCHEDULED");

        kafkaTemplate.send("appointment_rescheduled", message);
        log.info("发送预约改期消息: {}", message);
    }
} 