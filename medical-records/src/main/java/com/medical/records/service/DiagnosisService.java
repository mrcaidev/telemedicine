package com.medical.records.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.medical.records.model.dto.DiagnosisQueryDTO;
import com.medical.records.model.entity.Diagnosis;

import java.util.List;

/**
 * 诊断编码接口
 */
public interface DiagnosisService extends IService<Diagnosis> {
    /**
     * 获取诊断列表
     * @return
     */
    List<Diagnosis> getAll();

    /**
     * 分页查询信息
     * @param dto
     * @return
     */
    List<Diagnosis> listDiagnosis(DiagnosisQueryDTO dto);
    Diagnosis create(Diagnosis diagnosis);
    Diagnosis update(String code, Diagnosis updatedFields);
    void delete(String code);
}
