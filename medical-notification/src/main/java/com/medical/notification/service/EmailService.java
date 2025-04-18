package com.medical.notification.service;

/**
 * 邮件服务接口
 */
public interface EmailService {

    /**
     * 发送预约创建通知
     *
     * @param to 接收者邮箱
     * @param patientName 病人姓名
     * @param doctorName 医生姓名
     * @param appointmentTime 预约时间
     */
    void sendAppointmentCreatedNotification(String to, String patientName, String doctorName, String appointmentTime);

    /**
     * 发送预约改期通知
     *
     * @param to 接收者邮箱
     * @param patientName 病人姓名
     * @param doctorName 医生姓名
     * @param oldTime 原预约时间
     * @param newTime 新预约时间
     */
    void sendAppointmentRescheduledNotification(String to, String patientName, String doctorName, String oldTime, String newTime);

    /**
     * 发送预约取消通知
     *
     * @param to 接收者邮箱
     * @param patientName 病人姓名
     * @param doctorName 医生姓名
     * @param appointmentTime 预约时间
     */
    void sendAppointmentCancelledNotification(String to, String patientName, String doctorName, String appointmentTime);
} 