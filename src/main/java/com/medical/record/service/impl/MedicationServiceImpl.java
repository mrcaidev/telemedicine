package com.medical.record.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.record.model.dto.MedicationQueryDTO;
import com.medical.record.model.entity.Medication;
import com.medical.record.repository.MedicationRepository;
import com.medical.record.service.MedicationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicationServiceImpl extends ServiceImpl<MedicationRepository, Medication> implements MedicationService {

    @Override
    public List<Medication> getAll() {
        return list();
    }

    @Override
    public List<Medication> listMedication(MedicationQueryDTO dto) {
        LambdaQueryWrapper<Medication> queryWrapper = new LambdaQueryWrapper<>();


        if (dto.getCode() != null && !dto.getCode().isEmpty()) {
            queryWrapper.eq(Medication::getCode, dto.getCode());
        }
        if (dto.getName() != null && !dto.getName().isEmpty()) {
            queryWrapper.eq(Medication::getName, dto.getName());
        }

        // 处理游标
        if (dto.getCursor() != null && !dto.getCursor().isEmpty()) {
            if ("asc".equalsIgnoreCase(dto.getCode())) {
                queryWrapper.gt(Medication::getCode, dto.getCursor());
            } else {
                queryWrapper.lt(Medication::getCode, dto.getCursor());
            }
        }

        // 设置排序
        if ("asc".equalsIgnoreCase(dto.getSort_info())) {
            queryWrapper.orderByAsc(Medication::getCode, Medication::getCode);
        } else {
            queryWrapper.orderByDesc(Medication::getCode, Medication::getCode);
        }

        // 限制查询条数
        queryWrapper.last("LIMIT " + dto.getLimit());

        // 查询预约列表
        List<Medication> medicationList = list(queryWrapper);

        return medicationList;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Medication create(Medication medication) {
        save(medication);
        return medication;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Medication update(String code, Medication updatedFields) {
        Medication medication = getById(code)
                ;//.orElseThrow(() -> new IllegalArgumentException("Medication not found"));
        if (medication == null) {
            throw new IllegalArgumentException("Medication not found");
        }
        if (updatedFields.getName() != null) {
            medication.setName(updatedFields.getName());
        }

        updateById(medication);
        return medication;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String code) {
        removeById(code);
    }
}
