package com.medical.record.model.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("diagnoses")
public class Diagnosis {
    /**
     * 诊断编码
     */
    @TableId(type = IdType.ASSIGN_ID)
    private String code;
    /**
     * 诊断描述
     */
    private String description;
}