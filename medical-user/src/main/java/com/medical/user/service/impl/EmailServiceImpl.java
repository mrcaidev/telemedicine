package com.medical.user.service.impl;

import com.medical.user.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import cn.hutool.core.util.RandomUtil;

import java.util.concurrent.TimeUnit;

/**
 * 邮件服务实现类
 */
@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Value("${spring.mail.username}")
    private String from;

    private static final String VERIFY_CODE_PREFIX = "userRegister:";
    private static final long VERIFY_CODE_EXPIRE = 5; // 验证码有效期5分钟

    @Override
    public String sendVerifyCode(String email) {
        // 生成6位数字验证码
        String code = RandomUtil.randomNumbers(6);

        try {
            // 创建邮件消息
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(email);
            helper.setSubject("医疗平台验证码");

            // 邮件内容
            String content = String.format(
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;'>" +
                "<h2 style='color: #2c3e50;'>验证码</h2>" +
                "<p>您的验证码是：<strong style='color: #e74c3c; font-size: 20px;'>%s</strong></p>" +
                "<p>验证码有效期为5分钟，请尽快使用。</p>" +
                "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>" +
                "<p style='color: #7f8c8d; font-size: 12px;'>此邮件为系统自动发送，请勿回复。如有问题，请联系客服。</p>" +
                "</div>",
                code
            );
            helper.setText(content, true);

            // 发送邮件
            mailSender.send(message);
            log.info("验证码邮件发送成功: {}", email);

            // 将验证码保存到Redis，设置5分钟过期
            String key = VERIFY_CODE_PREFIX + email;
            redisTemplate.opsForValue().set(key, code, VERIFY_CODE_EXPIRE, TimeUnit.MINUTES);

            return code;
        } catch (MessagingException e) {
            log.error("验证码邮件发送失败: {}, error: {}", email, e.getMessage());
            throw new RuntimeException("验证码邮件发送失败", e);
        }
    }

    @Override
    public boolean verifyCode(String email, String code) {
        if (code == null || code.isEmpty()) {
            return false;
        }

        String key = VERIFY_CODE_PREFIX + email;
        String savedCode = redisTemplate.opsForValue().get(key);

        if (savedCode != null && savedCode.equals(code)) {
            // 验证成功后删除验证码
            redisTemplate.delete(key);
            return true;
        }
        return false;
    }
}
