package com.medical.record.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.record.model.entity.Medication;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MedicationRepository extends BaseMapper<Medication> {
}
