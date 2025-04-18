package com.medical.notification.service.impl;

import com.medical.notification.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.annotation.Resource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;

/**
 * 邮件服务实现类
 */
@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Resource
    private JavaMailSender mailSender;

    @Resource
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String from;

    @Override
    public void sendAppointmentCreatedNotification(String to, String patientName, String doctorName, String appointmentTime) {
        String subject = "预约创建成功通知";
        Map<String, Object> variables = new HashMap<>();
        variables.put("patientName", patientName);
        variables.put("doctorName", doctorName);
        variables.put("appointmentTime", appointmentTime);
        String template = "appointment-created";
        
        sendEmail(to, subject, template, variables);
    }

    @Override
    public void sendAppointmentRescheduledNotification(String to, String patientName, String doctorName, String oldTime, String newTime) {
        String subject = "预约改期通知";
        Map<String, Object> variables = new HashMap<>();
        variables.put("patientName", patientName);
        variables.put("doctorName", doctorName);
        variables.put("oldTime", oldTime);
        variables.put("newTime", newTime);
        String template = "appointment-rescheduled";
        
        sendEmail(to, subject, template, variables);
    }

    @Override
    public void sendAppointmentCancelledNotification(String to, String patientName, String doctorName, String appointmentTime) {
        String subject = "预约取消通知";
        Map<String, Object> variables = new HashMap<>();
        variables.put("patientName", patientName);
        variables.put("doctorName", doctorName);
        variables.put("appointmentTime", appointmentTime);
        String template = "appointment-cancelled";
        
        sendEmail(to, subject, template, variables);
    }

    /**
     * 发送邮件
     *
     * @param to 接收者邮箱
     * @param subject 主题
     * @param template 模板名称
     * @param variables 模板变量
     */
    private void sendEmail(String to, String subject, String template, Map<String, Object> variables) {
        try {
            // 创建邮件内容
            Context context = new Context();
            variables.forEach(context::setVariable);
            String content = templateEngine.process(template, context);

            // 创建邮件消息
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);

            // 发送邮件
            mailSender.send(message);
            log.info("邮件发送成功: to={}, subject={}", to, subject);
        } catch (MessagingException e) {
            log.error("邮件发送失败: to={}, subject={}, error={}", to, subject, e.getMessage());
            throw new RuntimeException("邮件发送失败", e);
        }
    }
} 