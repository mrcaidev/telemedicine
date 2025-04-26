package com.medical.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.user.model.entity.Clinic;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ClinicMapper extends BaseMapper<Clinic> {
}
