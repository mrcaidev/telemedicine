package com.medical.record.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.record.model.entity.LabTest;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface LabTestRepository extends BaseMapper<LabTest> {
}
