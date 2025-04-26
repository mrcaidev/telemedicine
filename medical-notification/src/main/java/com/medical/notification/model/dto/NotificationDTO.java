package com.medical.notification.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 通知创建数据传输对象
 */
@Data
@Schema(description = "通知创建数据传输对象")
public class NotificationDTO {

    @Schema(description = "用户ID", required = true)
    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @Schema(description = "通知类型", required = true)
    @NotBlank(message = "通知类型不能为空")
    private String type;

    @Schema(description = "通知标题", required = true)
    @NotBlank(message = "通知标题不能为空")
    private String title;

    @Schema(description = "通知内容", required = true)
    @NotBlank(message = "通知内容不能为空")
    private String content;
} 