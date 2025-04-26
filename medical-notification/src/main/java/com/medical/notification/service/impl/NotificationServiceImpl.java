package com.medical.notification.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.notification.mapper.NotificationMapper;
import com.medical.notification.model.dto.NotificationDTO;
import com.medical.notification.model.entity.Notification;
import com.medical.notification.model.vo.NotificationVO;
import com.medical.notification.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 通知服务实现类
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class NotificationServiceImpl extends ServiceImpl<NotificationMapper, Notification> implements NotificationService {

    @Override
    public Long createNotification(NotificationDTO notificationDTO) {
        log.info("创建通知: {}", notificationDTO);
        
        // 转换DTO为实体
        Notification notification = new Notification();
        BeanUtils.copyProperties(notificationDTO, notification);
        
        // 设置初始状态
        notification.setIsRead(0);
        
        // 保存通知
        save(notification);
        
        return notification.getId();
    }

    @Override
    public List<NotificationVO> getUserNotifications(Long userId) {
        log.info("获取用户通知列表, userId: {}", userId);
        
        // 构建查询条件
        LambdaQueryWrapper<Notification> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Notification::getUserId, userId)
                   .eq(Notification::getIsDeleted, 0)
                   .orderByDesc(Notification::getCreateTime);
        
        // 查询通知列表
        List<Notification> notifications = list(queryWrapper);
        
        // 转换为VO列表
        return notifications.stream().map(notification -> {
            NotificationVO vo = new NotificationVO();
            BeanUtils.copyProperties(notification, vo);
            return vo;
        }).collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long id) {
        log.info("标记通知为已读, id: {}", id);
        
        // 构建更新条件
        LambdaUpdateWrapper<Notification> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(Notification::getId, id)
                    .eq(Notification::getIsDeleted, 0)
                    .set(Notification::getIsRead, 1);
        
        // 更新通知状态
        update(updateWrapper);
    }

    @Override
    public void deleteNotification(Long id) {
        log.info("删除通知, id: {}", id);
        
        // 执行软删除
        removeById(id);
    }
} 