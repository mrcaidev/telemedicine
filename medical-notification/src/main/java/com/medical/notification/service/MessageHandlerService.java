package com.medical.notification.service;

/**
 * 消息处理服务接口
 */
public interface MessageHandlerService {
    
    /**
     * 处理预约创建消息
     *
     * @param message 消息内容
     */
    void handleAppointmentCreated(String message);

    /**
     * 处理预约重新安排消息
     *
     * @param message 消息内容
     */
    void handleAppointmentRescheduled(String message);

    /**
     * 处理预约取消消息
     *
     * @param message 消息内容
     */
    void handleAppointmentCancelled(String message);
} 