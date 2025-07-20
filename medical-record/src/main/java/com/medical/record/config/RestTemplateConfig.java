package com.medical.record.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
//    @Value("${rest.template.connect-timeout}")
    private int connectTimeout=5000;// 连接超时：5秒

//    @Value("${rest.template.read-timeout}")
    private int readTimeout=30000;// 读取超时：30秒

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
