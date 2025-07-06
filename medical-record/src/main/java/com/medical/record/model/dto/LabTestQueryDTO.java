package com.medical.record.model.dto;

import lombok.Data;

@Data
public class LabTestQueryDTO {
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
    private String sort_info = "asc";
    /**
     * 检验项目编码
     */
    private String code;
    /**
     * 检验项目名称
     */
    private String name;
}
