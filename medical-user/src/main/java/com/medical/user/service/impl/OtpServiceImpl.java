package com.medical.user.service.impl;

import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.user.mapper.OtpCodeMapper;
import com.medical.user.model.dto.OtpDTO;
import com.medical.user.model.entity.OtpCode;
import com.medical.user.service.EmailService;
import com.medical.user.service.OtpService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 验证码服务实现
 */
@Service
@Slf4j
public class OtpServiceImpl extends ServiceImpl<OtpCodeMapper, OtpCode> implements OtpService {

    @Autowired
    private EmailService emailService;

    /**
     * 验证码有效时间（分钟）
     */
    private static final int OTP_EXPIRE_MINUTES = 10;

    /**
     * 发送验证码
     *
     * @param otpDTO 验证码DTO
     */
    @Override
    public void sendOtp(OtpDTO otpDTO) {
        // 使用EmailService发送验证码
        String code = emailService.sendVerifyCode(otpDTO.getEmail());
        
        // 计算过期时间
        LocalDateTime expireTime = LocalDateTime.now().plusMinutes(OTP_EXPIRE_MINUTES);

        // 保存验证码
        OtpCode otpCode = new OtpCode();
        otpCode.setEmail(otpDTO.getEmail());
        otpCode.setCode(code);
        otpCode.setExpireTime(expireTime);
        otpCode.setUsed(0);

        // 先删除该邮箱的旧验证码
        remove(new LambdaQueryWrapper<OtpCode>().eq(OtpCode::getEmail, otpDTO.getEmail()));
        // 保存新验证码
        save(otpCode);
    }

    /**
     * 验证验证码
     *
     * @param email 邮箱
     * @param code  验证码
     * @return 是否验证成功
     */
    @Override
    public boolean verifyOtp(String email, String code) {
        // 使用EmailService验证验证码
        if (!emailService.verifyCode(email, code)) {
            return false;
        }

        // 查询验证码
        OtpCode otpCode = getOne(new LambdaQueryWrapper<OtpCode>()
                .eq(OtpCode::getEmail, email)
                .eq(OtpCode::getCode, code)
                .eq(OtpCode::getUsed, 0));

        // 验证码不存在
        if (otpCode == null) {
            return false;
        }

        // 验证码已过期
        if (LocalDateTime.now().isAfter(otpCode.getExpireTime())) {
            return false;
        }

        // 标记验证码为已使用
        otpCode.setUsed(1);
        updateById(otpCode);

        return true;
    }
} 