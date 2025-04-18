package com.medical.user.controller;

import com.medical.user.common.Result;
import com.medical.user.model.dto.LoginDTO;
import com.medical.user.model.dto.PatientRegisterDTO;
import com.medical.user.model.dto.UserUpdateDTO;
import com.medical.user.model.vo.UserVO;
import com.medical.user.model.vo.PatientVO;
import com.medical.user.model.vo.DoctorVO;
import com.medical.user.service.EmailService;
import com.medical.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@Slf4j
@RestController

@Tag(name = "用户管理", description = "用户相关接口")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    /**
     * 获取当前登录用户
     */
    @GetMapping("/auth/me")
    @Operation(summary = "获取当前用户", description = "获取当前登录用户的详细信息")
    public Result<UserVO> getCurrentUser(@Parameter(description = "Token") @RequestHeader("Authorization") String token) {
        UserVO userVO = userService.getCurrentUser(token.replace("Bearer ", ""));
        return Result.success(userVO);
    }

    /**
     * 登录
     */
    @PostMapping("/auth/login")
    @Operation(summary = "邮箱密码登录", description = "通过邮箱和密码登录平台")
    @ResponseStatus(HttpStatus.CREATED)
    public Result<UserVO> login(@Valid @RequestBody LoginDTO loginDTO) {
        UserVO userVO = userService.login(loginDTO);
        return Result.success(userVO);
    }

    /**
     * 发送注册验证码
     */
    @PostMapping("/register/code")
    @Operation(summary = "发送注册验证码")
    public Result<Void> sendRegisterCode(@RequestParam String email) {
        log.info("发送注册验证码, email: {}", email);
        emailService.sendVerifyCode(email);
        return Result.success();
    }

    /**
     * 病人注册
     */
    @PostMapping("/patients")
    @Operation(summary = "病人注册")
    @ResponseStatus(HttpStatus.CREATED)
    public Result<PatientVO> register(@RequestBody @Valid PatientRegisterDTO registerDTO) {
        log.info("病人注册: {}", registerDTO);
        PatientVO patientVO = userService.registerPatient(registerDTO);
        return Result.success(patientVO);
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新用户信息", description = "更新用户的基本信息")
    @ResponseStatus(HttpStatus.OK)
    public Result<UserVO> updateUser(@Parameter(description = "用户ID") @PathVariable String id,
                                     @RequestBody UserUpdateDTO userUpdateDTO) {
        log.info("更新用户信息: {}", userUpdateDTO);
        UserVO userVO = userService.updateUser(id, userUpdateDTO);
        return Result.success(userVO);
    }

    /**
     * 通过ID获取用户信息
     */
    @GetMapping("/{id}")
    @Operation(summary = "通过ID获取用户信息", description = "通过用户ID获取用户详细信息")
    @ResponseStatus(HttpStatus.OK)
    public Result<UserVO> getUserById(@Parameter(description = "用户ID") @PathVariable String id) {
        log.info("获取用户信息: {}", id);
        UserVO userVO = userService.getUserById(id);
        return Result.success(userVO);
    }

    /**
     * 通过邮箱获取用户信息
     */
    @GetMapping("/email/{email}")
    @Operation(summary = "通过邮箱获取用户信息", description = "通过用户邮箱获取用户详细信息")
    @ResponseStatus(HttpStatus.OK)
    public Result<UserVO> getUserByEmail(@Parameter(description = "用户邮箱") @PathVariable String email) {
        log.info("通过邮箱获取用户信息: {}", email);
        UserVO userVO = userService.getUserByEmail(email);
        return Result.success(userVO);
    }

    /**
     * 通过ID获取患者信息
     *
     * @param id 患者ID
     * @return 患者信息
     */
    @GetMapping("/users/{id}")
    @Operation(summary = "获取患者信息", description = "通过ID获取患者详细信息")
    public com.medical.common.result.Result<PatientVO> getUserByIds(
            @Parameter(description = "患者ID") @PathVariable String id) {
        return userService.getUserDetailById(id);
    }

    /**
     * 通过ID获取医生信息
     *
     * @param id 医生ID
     * @return 医生信息
     */
    @GetMapping("/doctors/{id}")
    @Operation(summary = "获取医生信息", description = "通过ID获取医生详细信息")
    public com.medical.common.result.Result<DoctorVO> getDoctorById(
            @Parameter(description = "医生ID") @PathVariable String id) {
        return userService.getDoctorDetailById(id);
    }
}
