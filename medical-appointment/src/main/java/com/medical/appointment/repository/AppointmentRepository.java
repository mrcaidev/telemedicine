package com.medical.appointment.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.appointment.model.entity.Appointment;
import org.apache.ibatis.annotations.Mapper;

/**
 * 预约DAO
 */
@Mapper
public interface AppointmentRepository extends BaseMapper<Appointment> {
} 