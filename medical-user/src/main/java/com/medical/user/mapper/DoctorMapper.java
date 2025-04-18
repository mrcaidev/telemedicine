package com.medical.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.user.model.entity.Doctor;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 医生Mapper接口
 */
@Mapper
public interface DoctorMapper extends BaseMapper<Doctor> {

}
