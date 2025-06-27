package com.medical.record.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("medications")
public class Medication {
    /**
     * 药物编码
     */
    @TableId(type = IdType.ASSIGN_ID)
    private String code;
    /**
     * 药物名称
     */
    private String name;
}