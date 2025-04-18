package com.medical.notification.controller;

import com.medical.common.result.Result;
import com.medical.notification.model.dto.NotificationDTO;
import com.medical.notification.model.vo.NotificationVO;
import com.medical.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 通知管理控制器
 */
@RestController
@RequestMapping("/notifications")
@Tag(name = "通知管理", description = "通知相关接口")
@Slf4j
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * 创建通知
     */
    @PostMapping
    @Operation(summary = "创建通知")
    public Result<Long> createNotification(@RequestBody @Valid NotificationDTO notificationDTO) {
        Long id = notificationService.createNotification(notificationDTO);
        return Result.success(id);
    }

    /**
     * 获取用户的所有通知
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "获取用户的通知列表")
    public Result<List<NotificationVO>> getUserNotifications(@PathVariable Long userId) {
        List<NotificationVO> notifications = notificationService.getUserNotifications(userId);
        return Result.success(notifications);
    }

    /**
     * 将通知标记为已读
     */
    @PutMapping("/{id}/read")
    @Operation(summary = "将通知标记为已读")
    public Result<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return Result.success();
    }

    /**
     * 删除通知
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除通知")
    public Result<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return Result.success();
    }
} 