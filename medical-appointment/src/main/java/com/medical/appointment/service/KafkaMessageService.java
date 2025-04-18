package com.medical.appointment.service;

/**
 * Kafka消息服务
 */
public interface KafkaMessageService {

    /**
     * 发送预约创建消息
     *
     * @param userId 用户ID
     * @param appointmentId 预约ID
     * @param title 消息标题
     * @param content 消息内容
     */
    void sendAppointmentCreatedMessage(String userId, String appointmentId, String title, String content);

    /**
     * 发送预约取消消息
     *
     * @param userId 用户ID
     * @param appointmentId 预约ID
     * @param title 消息标题
     * @param content 消息内容
     */
    void sendAppointmentCancelledMessage(String userId, String appointmentId, String title, String content);

    /**
     * 发送预约改期消息
     *
     * @param userId 用户ID
     * @param appointmentId 预约ID
     * @param title 消息标题
     * @param content 消息内容
     */
    void sendAppointmentRescheduledMessage(String userId, String appointmentId, String title, String content);
} 