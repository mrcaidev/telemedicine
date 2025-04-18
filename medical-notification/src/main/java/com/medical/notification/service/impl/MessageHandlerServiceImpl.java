package com.medical.notification.service.impl;

import cn.hutool.json.JSONUtil;
import com.medical.notification.model.dto.NotificationDTO;
import com.medical.notification.service.MessageHandlerService;
import com.medical.notification.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 消息处理服务实现类
 */
@Slf4j
@Service
public class MessageHandlerServiceImpl implements MessageHandlerService {

    @Autowired
    private NotificationService notificationService;

    @Override
    public void handleAppointmentCreated(String message) {
        log.info("处理预约创建消息: {}", message);
        try {
            // 解析消息内容
            NotificationDTO notificationDTO = JSONUtil.toBean(message, NotificationDTO.class);
            
            // 设置通知类型
            notificationDTO.setType("APPOINTMENT_CREATED");
            
            // 创建通知
            notificationService.createNotification(notificationDTO);
            
            log.info("预约创建通知发送成功");
        } catch (Exception e) {
            log.error("处理预约创建消息失败", e);
        }
    }

    @Override
    public void handleAppointmentRescheduled(String message) {
        log.info("处理预约重新安排消息: {}", message);
        try {
            // 解析消息内容
            NotificationDTO notificationDTO = JSONUtil.toBean(message, NotificationDTO.class);
            
            // 设置通知类型
            notificationDTO.setType("APPOINTMENT_RESCHEDULED");
            
            // 创建通知
            notificationService.createNotification(notificationDTO);
            
            log.info("预约重新安排通知发送成功");
        } catch (Exception e) {
            log.error("处理预约重新安排消息失败", e);
        }
    }

    @Override
    public void handleAppointmentCancelled(String message) {
        log.info("处理预约取消消息: {}", message);
        try {
            // 解析消息内容
            NotificationDTO notificationDTO = JSONUtil.toBean(message, NotificationDTO.class);
            
            // 设置通知类型
            notificationDTO.setType("APPOINTMENT_CANCELLED");
            
            // 创建通知
            notificationService.createNotification(notificationDTO);
            
            log.info("预约取消通知发送成功");
        } catch (Exception e) {
            log.error("处理预约取消消息失败", e);
        }
    }
} 