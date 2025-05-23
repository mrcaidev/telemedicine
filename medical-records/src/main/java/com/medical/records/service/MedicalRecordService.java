package com.medical.records.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.medical.records.model.dto.MedicalRecordCreateDTO;
import com.medical.records.model.dto.MedicalRecordQueryDTO;
import com.medical.records.model.dto.MedicalRecordUpdateDTO;
import com.medical.records.model.entity.MedicalRecord;
import com.medical.records.model.vo.MedicalRecordVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

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
