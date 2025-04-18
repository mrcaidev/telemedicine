package com.medical.notification.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 通知模板实体类
 */
@Data
@TableName("notification_template")
public class NotificationTemplate {
    /**
     * 模板ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 模板编码（唯一）
     */
    private String code;

    /**
     * 模板名称
     */
    private String name;

    /**
     * 模板类型：email-邮件，sms-短信
     */
    private String type;

    /**
     * 邮件主题
     */
    private String subject;

    /**
     * 模板内容
     */
    private String content;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
} 