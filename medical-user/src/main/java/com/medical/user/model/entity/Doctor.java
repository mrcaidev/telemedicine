package com.medical.user.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 医生实体类
 */
@Data
@TableName("doctor")
public class Doctor {

    /**
     * 用户ID
     */
    @TableId(value = "id", type = IdType.INPUT)
    private String userId;

    /**
     * 名
     */
    private String firstName;

    /**
     * 姓
     */
    private String lastName;

    /**
     * 描述
     */
    private String description;

    /**
     * 专业领域，以JSON数组形式存储
     */
    private String specialties;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /**
     * 逻辑删除：0-未删除，1-已删除
     */
    @TableLogic
    private Integer deleted;
}
