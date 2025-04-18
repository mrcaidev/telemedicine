package com.medical.notification.model.event;

import lombok.Data;

/**
 * 预约事件
 */
@Data
public class AppointmentEvent {

    /**
     * 预约ID
     */
    private String appointmentId;

    /**
     * 病人ID
     */
    private String patientId;

    /**
     * 病人姓名
     */
    private String patientName;

    /**
     * 病人邮箱
     */
    private String patientEmail;

    /**
     * 医生ID
     */
    private String doctorId;

    /**
     * 医生姓名
     */
    private String doctorName;

    /**
     * 医生邮箱
     */
    private String doctorEmail;

    /**
     * 预约时间
     */
    private String appointmentTime;

    /**
     * 原预约时间（仅改期时使用）
     */
    private String oldTime;

    /**
     * 新预约时间（仅改期时使用）
     */
    private String newTime;

    /**
     * 事件类型：created-创建，rescheduled-改期，cancelled-取消
     */
    private String eventType;
} 