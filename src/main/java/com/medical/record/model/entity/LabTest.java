package com.medical.record.model.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 检验项目表
 */
@Data
@TableName("lab_tests")
public class LabTest {
    /**
     * 检验项目编码
     */
    @TableId(type = IdType.ASSIGN_ID)
    private String code;
    /**
     * 检验项目名称
     */
    private String name;
}
