package com.medical.user.model.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 诊所实体类
 */
@Data
@TableName("clinic")
public class Clinic {

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.INPUT)
    private String id;

    /**
     * 诊所名称
     */
    private String name;

    /**
     * 地址
     */
    private String address;

    /**
     * 电话
     */
    private String phone;

    /**
     * 描述
     */
    private String description;

    /**
     * Logo URL
     */
    private String logoUrl;

    /**
     * 营业时间
     */
    private String businessHours;

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
     * 是否删除: 0-未删除, 1-已删除
     */
    @TableLogic
    private Integer isDeleted;
}
