package com.medical.user.service;

import com.medical.common.result.Result;
import com.medical.user.model.dto.LoginDTO;
import com.medical.user.model.dto.PatientRegisterDTO;
import com.medical.user.model.dto.UserUpdateDTO;
import com.medical.user.model.vo.PatientVO;
import com.medical.user.model.vo.UserVO;
import com.medical.user.model.vo.DoctorVO;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 通过ID获取用户信息
     *
     * @param id 用户ID
     * @return 用户信息
     */
    UserVO getUserById(String id);

    /**
     * 通过邮箱获取用户信息
     *
     * @param email 邮箱
     * @return 用户信息
     */
    UserVO getUserByEmail(String email);

    /**
     * 更新用户信息
     *
     * @param id 用户ID
     * @param userUpdateDTO 用户更新DTO
     * @return 更新后的用户信息
     */
    UserVO updateUser(String id, UserUpdateDTO userUpdateDTO);

    /**
     * 登录
     *
     * @param loginDTO 登录DTO
     * @return 用户信息和token
     */
    UserVO login(LoginDTO loginDTO);

    /**
     * 获取当前登录用户
     *
     * @param token 令牌
     * @return 用户信息
     */
    UserVO getCurrentUser(String token);

    /**
     * 病人注册
     *
     * @param registerDTO 注册信息
     * @return JWT token
     */
    PatientVO registerPatient(PatientRegisterDTO registerDTO);

    /**
     * 通过ID获取患者详情
     *
     * @param id 用户ID
     * @return 患者详情
     */
    Result<PatientVO> getUserDetailById(String id);

    /**
     * 通过ID获取医生详情
     *
     * @param id 医生ID
     * @return 医生详情
     */
    Result<DoctorVO> getDoctorDetailById(String id);
}
