package com.medical.record.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.medical.record.model.dto.MedicationQueryDTO;
import com.medical.record.model.entity.Medication;

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