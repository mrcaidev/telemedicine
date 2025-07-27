package com.medical.record.config;

import com.baomidou.mybatisplus.core.config.GlobalConfig;
import com.baomidou.mybatisplus.core.incrementer.IdentifierGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * ClassName:MyBatisPlusConfig
 * Package:com.medical.record.config
 * Description:
 *
 * @Author runge
 * @Create 2025/7/27 19:22
 * @Version 1.0
 */
@Configuration
public class MyBatisPlusConfig {
    @Bean
    public GlobalConfig globalConfig() {
        GlobalConfig globalConfig = new GlobalConfig();
        globalConfig.setIdentifierGenerator(new CustomUuidGenerator());
        return globalConfig;
    }
    @Bean
    public IdentifierGenerator identifierGenerator() {
        return new CustomUuidGenerator();
    }
}
