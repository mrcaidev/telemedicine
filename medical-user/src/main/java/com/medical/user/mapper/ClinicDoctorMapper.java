package com.medical.user.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.user.model.entity.ClinicDoctor;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ClinicDoctorMapper extends BaseMapper<ClinicDoctor> {

    /**
     * 根据医生 ID 查询一条记录
     * @param doctorId 医生 ID
     * @return ClinicDoctor 实体对象
     */
    ClinicDoctor getOneByDoctorId(String doctorId);
}
