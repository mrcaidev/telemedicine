package com.medical.user.model.dto;

import lombok.Data;

import java.time.LocalDate;

/**
 * 用户更新DTO
 */
@Data
public class UserUpdateDTO {

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像URL
     */
    private String avatarUrl;

    /**
     * 性别：male-男，female-女
     */
    private String gender;

    /**
     * 出生日期
     */
    private LocalDate birthDate;
} 