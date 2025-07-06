package com.medical.record.model.dto;

import lombok.Data;

@Data
public class MedicationQueryDTO {
    /**
     * 每页大小
     */
    private Integer limit = 10;

    /**
     * 游标
     */
    private String cursor;

    /**
     * 按编码排序方式
     */
    private String sort_info = "asc";
    /**
     * 药物编码
     */
    private String code;
    /**
     * 药物名称
     */
    private String name;
}
