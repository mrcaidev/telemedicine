package com.medical.record.model.dto;

import lombok.Data;


@Data
public class MedicalRecordQueryDTO {
    /**
     * 病人ID
     */
    private String patientId;

    /**
     * 每页大小
     */
    private Integer limit = 10;

    /**
     * 游标
     */
    private String cursor;

    /**
     * 按日期排序方式
     */
    private String sort_date = "asc";
}
