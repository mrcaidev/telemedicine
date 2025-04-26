package com.medical.notification.model.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 通知返回对象
 */
@Data
@Schema(description = "通知返回对象")
public class NotificationVO {

    @Schema(description = "通知ID")
    private Long id;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "通知类型")
    private String type;

    @Schema(description = "通知标题")
    private String title;

    @Schema(description = "通知内容")
    private String content;

    @Schema(description = "是否已读：0-未读，1-已读")
    private Integer isRead;

    @Schema(description = "创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
} 