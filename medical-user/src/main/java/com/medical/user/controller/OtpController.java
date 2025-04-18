package com.medical.user.controller;

import com.medical.user.common.Result;
import com.medical.user.model.dto.OtpDTO;
import com.medical.user.service.OtpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 验证码控制器
 */
@RestController
@Tag(name = "验证码管理", description = "验证码相关接口")
public class OtpController {

    @Resource
    private OtpService otpService;

    /**
     * 发送验证码
     *
     * @param otpDTO 验证码DTO
     * @return 结果
     */
    @PostMapping("/otp")
    @Operation(summary = "发送验证码", description = "向指定邮箱发送一条验证码")
    @ResponseStatus(HttpStatus.CREATED)
    public Result<Void> sendOtp(@Valid @RequestBody OtpDTO otpDTO) {
        otpService.sendOtp(otpDTO);
        return Result.success(null);
    }
} 