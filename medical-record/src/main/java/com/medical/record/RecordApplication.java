package com.medical.record;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 病例服务启动类
 */
@SpringBootApplication
@EnableFeignClients(basePackages = "com.medical")
//@EnableKafka
@MapperScan("com.medical.record.repository")
public class RecordApplication {
    public static void main(String[] args) {
        SpringApplication.run(RecordApplication.class, args);
    }

} 