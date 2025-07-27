package com.medical.record.config;

import com.baomidou.mybatisplus.core.incrementer.IdentifierGenerator;

import java.util.UUID;

/**
 * ClassName:CustomUuidGenerator
 * Package:com.medical.record.config
 * Description:
 *
 * @Author runge
 * @Create 2025/7/27 19:16
 * @Version 1.0
 */
public class CustomUuidGenerator implements IdentifierGenerator {

    @Override
    public Number nextId(Object entity) {
        return null;
    }

    @Override
    public String nextUUID(Object entity) {
        return UUID.randomUUID().toString();
    }
}
