package com.medical.appointment.model.vo;


import lombok.Data;

import java.util.List;

/**
 * 预约列表
 */
@Data
public class AppointmentsVO {
    private List<AppointmentVO> appointments;
    private String nextCursor;
}
