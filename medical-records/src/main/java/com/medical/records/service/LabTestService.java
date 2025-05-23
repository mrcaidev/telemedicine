package com.medical.records.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.medical.records.model.dto.LabTestQueryDTO;
import com.medical.records.model.entity.LabTest;

import java.util.List;

public interface LabTestService extends IService<LabTest> {
    List<LabTest> getAll();

    /**
     * 分页查询
     * @param
     * @return
     */
    List<LabTest> listLabTest(LabTestQueryDTO dto);
    LabTest create(LabTest labTest);
    LabTest update(String code, LabTest updatedFields);
    void delete(String code);
}
