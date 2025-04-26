package com.medical.appointment.model.dto;

import lombok.Data;

import java.time.LocalDate;

/**
 * 预约查询DTO
 */
@Data
public class AppointmentQueryDTO {
    /**
     * 医生ID
     */
    private String doctorId;

    /**
     * 病人ID
     */
    private String patientId;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

    /**
     * 状态
     */
    private String status;

    /**
     * 每页大小
     */
    private Integer limit = 10;

    /**
     * 游标
     */
    private String cursor;

    /**
     * 按日期排序方式
     */
    private String sort_date = "asc";
} 