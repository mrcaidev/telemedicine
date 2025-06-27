package com.medical.record.model.vo;


import lombok.Data;

@Data
public class ClinicVO {
    /**
     * 主键ID
     */
    private String id;

    /**
     * 诊所名称
     */
    private String name;

    private String createdAt;
}
