package com.medical.notification.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.notification.model.entity.Notification;
import org.apache.ibatis.annotations.Mapper;

/**
 * 通知Mapper接口
 */
@Mapper
public interface NotificationMapper extends BaseMapper<Notification> {
} 