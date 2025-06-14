package com.medical.record.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.record.model.dto.DiagnosisQueryDTO;
import com.medical.record.model.entity.Diagnosis;
import com.medical.record.repository.DiagnosisRepository;
import com.medical.record.service.DiagnosisService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DiagnosisServiceImpl extends ServiceImpl<DiagnosisRepository, Diagnosis> implements DiagnosisService {

    @Override
    public List<Diagnosis> getAll() {
        return list();
    }

    @Override
    public List<Diagnosis> listDiagnosis(DiagnosisQueryDTO dto) {
        LambdaQueryWrapper<Diagnosis> queryWrapper = new LambdaQueryWrapper<>();


        if (dto.getCode() != null && !dto.getCode().isEmpty()) {
            queryWrapper.eq(Diagnosis::getCode, dto.getCode());
        }
        if (dto.getDescription() != null && !dto.getDescription().isEmpty()) {
            queryWrapper.eq(Diagnosis::getDescription, dto.getDescription());
        }

        // 处理游标
        if (dto.getCursor() != null && !dto.getCursor().isEmpty()) {
            if ("asc".equalsIgnoreCase(dto.getCode())) {
                queryWrapper.gt(Diagnosis::getCode, dto.getCursor());
            } else {
                queryWrapper.lt(Diagnosis::getCode, dto.getCursor());
            }
        }

        // 设置排序
        if ("asc".equalsIgnoreCase(dto.getSort_info())) {
            queryWrapper.orderByAsc(Diagnosis::getCode, Diagnosis::getCode);
        } else {
            queryWrapper.orderByDesc(Diagnosis::getCode, Diagnosis::getCode);
        }

        // 限制查询条数
        queryWrapper.last("LIMIT " + dto.getLimit());

        // 查询预约列表
        List<Diagnosis> medicalRecords = list(queryWrapper);

        return medicalRecords;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Diagnosis create(Diagnosis diagnosis) {
        save(diagnosis);
        return diagnosis;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Diagnosis update(String code, Diagnosis updatedFields) {
        Diagnosis diagnosis = getById(code);
               // .orElseThrow(() -> new IllegalArgumentException("Diagnosis not found"));

        if (updatedFields.getDescription() != null) {
            diagnosis.setDescription(updatedFields.getDescription());
        }

        updateById(diagnosis);
        return diagnosis;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String code) {
        removeById(code);
    }
}
