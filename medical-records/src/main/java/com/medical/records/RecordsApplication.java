package com.medical.records;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.kafka.annotation.EnableKafka;

/**
 * 病例服务启动类
 */
@SpringBootApplication
@EnableFeignClients(basePackages = "com.medical")
@EnableKafka
@MapperScan("com.medical.records.repository")
public class RecordsApplication {
    public static void main(String[] args) {
        SpringApplication.run(RecordsApplication.class, args);
    }

} 