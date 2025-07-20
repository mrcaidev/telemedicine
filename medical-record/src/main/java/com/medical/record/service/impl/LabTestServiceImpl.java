package com.medical.record.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.record.model.dto.LabTestQueryDTO;
import com.medical.record.model.entity.LabTest;
import com.medical.record.repository.LabTestRepository;
import com.medical.record.service.LabTestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LabTestServiceImpl extends ServiceImpl<LabTestRepository, LabTest> implements LabTestService {


    @Override
    public List<LabTest> getAll() {
        return list();
    }

    @Override
    public List<LabTest> listLabTest(LabTestQueryDTO dto) {
        LambdaQueryWrapper<LabTest> queryWrapper = new LambdaQueryWrapper<>();


        if (dto.getCode() != null && !dto.getCode().isEmpty()) {
            queryWrapper.eq(LabTest::getCode, dto.getCode());
        }
        if (dto.getName() != null && !dto.getName().isEmpty()) {
            queryWrapper.eq(LabTest::getName, dto.getName());
        }

        // 处理游标
        if (dto.getCursor() != null && !dto.getCursor().isEmpty()) {
            if ("asc".equalsIgnoreCase(dto.getCode())) {
                queryWrapper.gt(LabTest::getCode, dto.getCursor());
            } else {
                queryWrapper.lt(LabTest::getCode, dto.getCursor());
            }
        }

        // 设置排序
        if ("asc".equalsIgnoreCase(dto.getSort_info())) {
            queryWrapper.orderByAsc(LabTest::getCode, LabTest::getCode);
        } else {
            queryWrapper.orderByDesc(LabTest::getCode, LabTest::getCode);
        }

        // 限制查询条数
        queryWrapper.last("LIMIT " + dto.getLimit());

        // 查询预约列表
        List<LabTest> labTestList = list(queryWrapper);

        return labTestList;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LabTest create(LabTest labTest) {
        save(labTest);
        return labTest;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public LabTest update(String code, LabTest updatedFields) {
        LabTest test = getById(code)
                ;//.orElseThrow(() -> new IllegalArgumentException("Lab test not found"));

        if (updatedFields.getName() != null) {
            test.setName(updatedFields.getName());
        }

        updateById(test);
        return test;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String code) {
        removeById(code);
    }
}