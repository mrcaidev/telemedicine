package com.medical.notification.service;

import com.medical.notification.model.dto.NotificationDTO;
import com.medical.notification.model.vo.NotificationVO;

import java.util.List;

/**
 * 通知服务接口
 */
public interface NotificationService {

    /**
     * 创建通知
     *
     * @param notificationDTO 通知信息
     * @return 通知ID
     */
    Long createNotification(NotificationDTO notificationDTO);

    /**
     * 获取用户的通知列表
     *
     * @param userId 用户ID
     * @return 通知列表
     */
    List<NotificationVO> getUserNotifications(Long userId);

    /**
     * 将通知标记为已读
     *
     * @param id 通知ID
     */
    void markAsRead(Long id);

    /**
     * 删除通知
     *
     * @param id 通知ID
     */
    void deleteNotification(Long id);
} 