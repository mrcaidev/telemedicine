package com.medical.record.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.medical.record.model.dto.MedicalRecordCreateDTO;
import com.medical.record.model.dto.MedicalRecordQueryDTO;
import com.medical.record.model.dto.MedicalRecordUpdateDTO;
import com.medical.record.model.entity.MedicalRecord;
import com.medical.record.model.vo.MedicalRecordVO;

import java.util.List;

public interface MedicalRecordService extends IService<MedicalRecord> {
    /**
     * 创建病例
     * @param recorddto
     * @return
     */
    MedicalRecordVO create(MedicalRecordCreateDTO recorddto);

    /**
     * 更新病历部分字段
     * @param id
     * @param updatedFields
     * @return
     */
    MedicalRecord update(String id, MedicalRecordUpdateDTO updatedFields);

    /**
     * 删除病例
     * @param id
     */
    void delete(String id);

    /**
     * 查看单条病历
     * @param id
     * @return
     */
    MedicalRecord getById(String id);

    /**
     * 获取患者病历列表
     * @return
     */
    List<MedicalRecordVO> listMedicalRecord(MedicalRecordQueryDTO queryDTO, String token);

    /**
     * 调用Gemini API生成摘要
     * @param id
     * @return
     */
    String getSummary(String id);
}
