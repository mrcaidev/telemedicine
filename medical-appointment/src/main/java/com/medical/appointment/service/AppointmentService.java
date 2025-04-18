package com.medical.appointment.service;

import com.medical.appointment.model.dto.AppointmentCreateDTO;
import com.medical.appointment.model.dto.AppointmentQueryDTO;
import com.medical.appointment.model.vo.AppointmentVO;
import java.util.List;

/**
 * 预约服务接口
 */
public interface AppointmentService {
    
    /**
     * 创建预约
     *
     * @param dto 预约创建DTO
     * @param patientId 病人ID
     * @param token 令牌
     * @return 预约详情
     */
    AppointmentVO createAppointment(AppointmentCreateDTO dto, String patientId, String token);
    
    /**
     * 查询预约列表
     *
     * @param dto 查询条件
     * @param token 令牌
     * @return 预约列表
     */
    List<AppointmentVO> listAppointments(AppointmentQueryDTO dto, String token);
    
    /**
     * 获取预约详情
     *
     * @param id 预约ID
     * @param userId 用户ID
     * @param token 令牌
     * @return 预约详情
     */
    AppointmentVO getAppointmentById(String id, String userId, String token);
    
    /**
     * 取消预约
     *
     * @param id 预约ID
     * @param userId 用户ID
     * @param token 令牌
     * @return 预约详情
     */
    AppointmentVO cancelAppointment(String id, String userId, String token);
} 