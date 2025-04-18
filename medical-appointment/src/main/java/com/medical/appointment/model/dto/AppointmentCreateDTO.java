package com.medical.appointment.model.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

/**
 * 预约创建DTO
 */
@Data
public class AppointmentCreateDTO {
    /**
     * 医生ID
     */
    @NotBlank(message = "医生ID不能为空")
    private String doctorId;

    /**
     * 预约日期
     */
    @NotNull(message = "预约日期不能为空")
    @FutureOrPresent(message = "预约日期必须是今天或将来的日期")
    private LocalDate date;

    /**
     * 开始时间
     */
    @NotBlank(message = "开始时间不能为空")
    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "开始时间格式必须是HH:mm")
    private String startTime;

    /**
     * 结束时间
     */
    @NotBlank(message = "结束时间不能为空")
    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "结束时间格式必须是HH:mm")
    private String endTime;

    /**
     * 备注
     */
    private String remark;
} 