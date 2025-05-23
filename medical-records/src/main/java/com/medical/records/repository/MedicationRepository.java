package com.medical.records.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.records.model.entity.Medication;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MedicationRepository extends BaseMapper<Medication> {
}
