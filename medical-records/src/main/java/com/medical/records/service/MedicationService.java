package com.medical.records.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.medical.records.model.dto.MedicationQueryDTO;
import com.medical.records.model.entity.Medication;

import java.util.List;

public interface MedicationService extends IService<Medication> {
    List<Medication> getAll();

    /**
     * 分页查询
     * @param medication
     * @return
     */
    List<Medication> listMedication(MedicationQueryDTO dto);
    Medication create(Medication medication);
    Medication update(String code, Medication updatedFields);
    void delete(String code);
}