package com.medical.user.model.entity;


import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 诊所 - 医生关联表实体类
 */
@Data
@TableName("clinic_doctor")
public class ClinicDoctor {
    /**
     * 主键 ID
     */
    @TableId(value = "id", type = IdType.INPUT)
    private String id;

    /**
     * 诊所 ID
     */
    private String clinicId;

    /**
     * 医生 ID
     */
    private String doctorId;

    /**
     * 职位
     */
    private String position;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

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
     * 是否删除: 0 - 未删除, 1 - 已删除
     */
    @TableLogic
    private Integer isDeleted;
}
