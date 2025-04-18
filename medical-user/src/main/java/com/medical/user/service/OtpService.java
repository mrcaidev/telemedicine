package com.medical.user.service;

import com.medical.user.model.dto.OtpDTO;

/**
 * 验证码服务接口
 */
public interface OtpService {

    /**
     * 发送验证码
     *
     * @param otpDTO 验证码DTO
     */
    void sendOtp(OtpDTO otpDTO);

    /**
     * 验证验证码
     *
     * @param email 邮箱
     * @param code 验证码
     * @return 是否验证成功
     */
    boolean verifyOtp(String email, String code);
} 