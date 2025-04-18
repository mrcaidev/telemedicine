package com.medical.user.model.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 医生视图对象
 */
@Data
public class DoctorVO {

    /**
     * 用户ID
     */
    private String id;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 名
     */
    private String firstName;

    /**
     * 姓
     */
    private String lastName;

    /**
     * 头像URL
     */
    private String avatarUrl;

    /**
     * 性别：male-男，female-女
     */
    private String gender;

    /**
     * 描述
     */
    private String description;

    /**
     * 专长列表
     */
    private List<String> specialties;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime createdAt;
} 