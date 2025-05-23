package com.medical.records.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.records.model.entity.MedicalRecord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MedicalRecordRepository  extends BaseMapper<MedicalRecord> {
}
