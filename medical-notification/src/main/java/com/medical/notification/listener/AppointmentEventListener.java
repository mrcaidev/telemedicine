package com.medical.notification.listener;

import com.medical.notification.model.event.AppointmentEvent;
import com.medical.notification.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;

/**
 * 预约事件监听器
 */
@Slf4j
@Component
public class AppointmentEventListener {

    @Resource
    private EmailService emailService;

    /**
     * 监听预约创建事件
     */
    @KafkaListener(topics = "appointment_created", groupId = "notification-service")
    public void handleAppointmentCreated(AppointmentEvent event) {
        log.info("收到预约创建事件: {}", event);
        emailService.sendAppointmentCreatedNotification(
            event.getPatientEmail(),
            event.getPatientName(),
            event.getDoctorName(),
            event.getAppointmentTime()
        );
    }

    /**
     * 监听预约改期事件
     */
    @KafkaListener(topics = "appointment_rescheduled", groupId = "notification-service")
    public void handleAppointmentRescheduled(AppointmentEvent event) {
        log.info("收到预约改期事件: {}", event);
        emailService.sendAppointmentRescheduledNotification(
            event.getPatientEmail(),
            event.getPatientName(),
            event.getDoctorName(),
            event.getOldTime(),
            event.getNewTime()
        );
    }

    /**
     * 监听预约取消事件
     */
    @KafkaListener(topics = "appointment_cancelled", groupId = "notification-service")
    public void handleAppointmentCancelled(AppointmentEvent event) {
        log.info("收到预约取消事件: {}", event);
        emailService.sendAppointmentCancelledNotification(
            event.getPatientEmail(),
            event.getPatientName(),
            event.getDoctorName(),
            event.getAppointmentTime()
        );
    }
} 