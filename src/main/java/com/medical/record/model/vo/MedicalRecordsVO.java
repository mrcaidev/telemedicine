package com.medical.record.model.vo;

import lombok.Data;

import java.util.List;

@Data
public class MedicalRecordsVO {
    private List<MedicalRecordVO> medicalRecords;
    private String nextCursor;
}
