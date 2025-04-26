package com.medical.appointment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import feign.Logger;

/**
 * Feign配置类
 */
@Configuration
public class FeignConfig {

    /**
     * 配置Feign日志级别
     *
     * @return 日志级别
     */
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
} 