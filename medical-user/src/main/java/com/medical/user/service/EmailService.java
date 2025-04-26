package com.medical.user.service;

/**
 * 邮件服务接口
 */
public interface EmailService {
    
    /**
     * 发送验证码邮件
     *
     * @param email 邮箱地址
     * @return 验证码
     */
    String sendVerifyCode(String email);

    /**
     * 验证验证码
     *
     * @param email 邮箱地址
     * @param code 验证码
     * @return 是否验证通过
     */
    boolean verifyCode(String email, String code);
} 