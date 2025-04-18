package com.medical.appointment.model.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 预约视图对象
 */
@Data
public class AppointmentVO {
    /**
     * ID
     */
    private String id;

    /**
     * 病人信息
     */
    private PatientVO patient;

    /**
     * 医生信息
     */
    private DoctorVO doctor;

    /**
     * 预约日期
     */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    /**
     * 开始时间
     */
    private String startTime;

    /**
     * 结束时间
     */
    private String endTime;

    /**
     * 备注
     */
    private String remark;

    /**
     * 状态：normal-正常，to_be_rescheduled-待重新安排，cancelled-已取消
     */
    private String status;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime createdAt;
} 