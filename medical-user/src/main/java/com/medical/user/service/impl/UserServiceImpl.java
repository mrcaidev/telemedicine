package com.medical.user.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.common.result.Result;
import com.medical.common.utils.JwtUtil;
import com.medical.user.exception.BusinessException;
import com.medical.user.mapper.ClinicDoctorMapper;
import com.medical.user.mapper.ClinicMapper;
import com.medical.user.mapper.DoctorMapper;
import com.medical.user.mapper.UserMapper;
import com.medical.user.model.dto.LoginDTO;
import com.medical.user.model.dto.PatientRegisterDTO;
import com.medical.user.model.dto.UserUpdateDTO;
import com.medical.user.model.entity.Clinic;
import com.medical.user.model.entity.ClinicDoctor;
import com.medical.user.model.entity.Doctor;
import com.medical.user.model.entity.User;
import com.medical.user.model.vo.ClinicVO;
import com.medical.user.model.vo.DoctorVO;
import com.medical.user.model.vo.PatientVO;
import com.medical.user.model.vo.UserVO;
import com.medical.user.service.EmailService;
import com.medical.user.service.UserService;
import com.medical.user.utils.JsonUtil;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现
 */
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Resource
    private DoctorMapper doctorMapper;
    @Autowired
    private ClinicMapper clinicMapper;
    @Autowired
    private ClinicDoctorMapper clinicDoctorMapper;

    /**
     * 通过ID获取用户信息
     *
     * @param id 用户ID
     * @return 用户信息
     */
    @Override
    public UserVO getUserById(String id) {
        User user = getById(id);
        if (user == null) {
            throw new BusinessException(40400, "用户不存在");
        }
        return convertToUserVO(user);
    }

    /**
     * 通过邮箱获取用户信息
     *
     * @param email 邮箱
     * @return 用户信息
     */
    @Override
    public UserVO getUserByEmail(String email) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getEmail, email));
        if (user == null) {
            throw new BusinessException(40400, "用户不存在");
        }
        return convertToUserVO(user);
    }

    /**
     * 更新用户信息
     *
     * @param id 用户ID
     * @param userUpdateDTO 用户更新DTO
     * @return 更新后的用户信息
     */
    @Override
    public UserVO updateUser(String id, UserUpdateDTO userUpdateDTO) {
        User user = getById(id);
        if (user == null) {
            throw new BusinessException(40400, "用户不存在");
        }

        if (userUpdateDTO.getNickname() != null) {
            user.setNickname(userUpdateDTO.getNickname());
        }
        if (userUpdateDTO.getAvatarUrl() != null) {
            user.setAvatarUrl(userUpdateDTO.getAvatarUrl());
        }
        if (userUpdateDTO.getGender() != null) {
            user.setGender(userUpdateDTO.getGender());
        }
        if (userUpdateDTO.getBirthDate() != null) {
            user.setBirthDate(userUpdateDTO.getBirthDate());
        }

        updateById(user);
        return convertToUserVO(user);
    }

    /**
     * 登录
     *
     * @param loginDTO 登录DTO
     * @return 用户信息和token
     */
    @Override
    public UserVO login(LoginDTO loginDTO) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getEmail, loginDTO.getEmail()));
        if (user == null) {
            throw new BusinessException(40100, "邮箱或密码不正确");
        }

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new BusinessException(40100, "邮箱或密码不正确");
        }

        UserVO userVO = convertToUserVO(user);
        BeanUtil.copyProperties(user, userVO);
        userVO.setRole(user.getUserType().toLowerCase());
        userVO.setToken(JwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserType()));
        if(StrUtil.isNotEmpty(user.getUserType())&&user.getUserType().toLowerCase().equals("DOCTOR".toLowerCase())){
            Doctor doctor = doctorMapper.selectById(user.getId());
            userVO.setFirstName(null == doctor?null:doctor.getFirstName());
            userVO.setLastName(null == doctor?null:doctor.getLastName());
            userVO.setDescription(null == doctor?null:doctor.getDescription());
            userVO.setSpecialties(null == doctor?null:doctor.getSpecialties());
            Clinic clinic = clinicMapper.selectById(user.getId());
            userVO.setClinic(clinic);
        }

        return userVO;
    }

    /**
     * 获取当前登录用户
     *
     * @param token 令牌
     * @return 用户信息
     */
    @Override
    public UserVO getCurrentUser(String token) {
        String userId = JwtUtil.getUserId(token);
        return getUserById(userId);
    }

    /**
     * 注册病人
     *
     * @param registerDTO 病人注册DTO
     * @return JWT token
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public PatientVO registerPatient(PatientRegisterDTO registerDTO) {
        // 验证验证码
        if (!emailService.verifyCode(registerDTO.getEmail(), registerDTO.getOtp())) {
            throw new BusinessException(42200, "验证码错误或已过期");
        }

        // 检查邮箱是否已注册
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getEmail, registerDTO.getEmail());
        if (this.count(queryWrapper) > 0) {
            throw new BusinessException(40900, "该邮箱已注册");
        }

        // 创建用户
        User user = new User();
        user.setId(IdUtil.simpleUUID().replaceAll("-",""));
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setUserType("PATIENT");

        // 保存用户
        if (!this.save(user)) {
            throw new BusinessException(50000, "注册失败");
        }

        // 生成token
        String token = JwtUtil.generateToken(user.getId(), user.getEmail(), user.getUserType());

        // 转换为PatientVO并返回
        PatientVO patientVO = new PatientVO();
        BeanUtil.copyProperties(user, patientVO);
        patientVO.setToken(token);
        patientVO.setRole(user.getUserType().toLowerCase());
        return patientVO;
    }

    /**
     * 将用户实体转换为VO
     *
     * @param user 用户实体
     * @return 用户VO
     */
    private UserVO convertToUserVO(User user) {
        UserVO userVO = new UserVO();
        BeanUtil.copyProperties(user, userVO);
        userVO.setRole(user.getUserType().toLowerCase());
        if(StrUtil.isNotEmpty(user.getUserType())&&user.getUserType().toLowerCase().equals("DOCTOR".toLowerCase())){
            Doctor doctor = doctorMapper.selectById(user.getId());
            userVO.setFirstName(null == doctor?null:doctor.getFirstName());
            userVO.setLastName(null == doctor?null:doctor.getLastName());
            userVO.setDescription(null == doctor?null:doctor.getDescription());
            userVO.setSpecialties(null == doctor?null:doctor.getSpecialties());
            Clinic clinic = clinicMapper.selectById(user.getId());
            userVO.setClinic(clinic);
        }
        return userVO;
    }

    @Override
    public Result<PatientVO> getUserDetailById(String id) {
        User user = getById(id);
        if (user == null) {
            return Result.failed("用户不存在");
        }
        if (!"PATIENT".equals(user.getUserType())) {
            return Result.failed("该用户不是患者");
        }

        PatientVO patientVO = new PatientVO();
        BeanUtil.copyProperties(user, patientVO);
        patientVO.setRole(user.getUserType().toLowerCase());
        return Result.success(patientVO);
    }

    @Override
    public Result<DoctorVO> getDoctorDetailById(String id) {
        // 获取用户基本信息
        User user = getById(id);
        if (user == null) {
            return Result.failed("用户不存在");
        }
        if (!"DOCTOR".equals(user.getUserType())) {
            return Result.failed("该用户不是医生");
        }

        // 获取医生扩展信息
        Doctor doctor = doctorMapper.selectById(id);
        if (doctor == null) {
            return Result.failed("医生信息不存在");
        }

        // 组装医生视图对象
        DoctorVO doctorVO = new DoctorVO();
        // 设置基本信息
        doctorVO.setId(user.getId());
        doctorVO.setEmail(user.getEmail());
        doctorVO.setFirstName(doctor.getFirstName());
        doctorVO.setLastName(doctor.getLastName());
        doctorVO.setAvatarUrl(user.getAvatarUrl());
        doctorVO.setGender(user.getGender());
        doctorVO.setCreatedAt(user.getCreatedAt());

        // 设置医生特有信息
        doctorVO.setDescription(doctor.getDescription());
        // 将JSON字符串转换为List
        if (doctor.getSpecialties() != null && !doctor.getSpecialties().isEmpty()) {
            doctorVO.setSpecialties(JsonUtil.parseArray(doctor.getSpecialties(), String.class));
        }

        doctorVO.setRole(user.getUserType().toLowerCase());
        ClinicDoctor clinicDoctor = clinicDoctorMapper.getOneByDoctorId(user.getId());
        if(null == clinicDoctor || StrUtil.isEmpty(clinicDoctor.getClinicId())){
            return Result.success(doctorVO);
        }
        Clinic clinic = clinicMapper.selectById(clinicDoctor.getClinicId());
        if(null == clinic){
            return Result.success(doctorVO);
        }
        ClinicVO clinicVO = new ClinicVO();
        clinicVO.setId(clinic.getId());
        clinicVO.setName(clinic.getName());
        clinicVO.setCreatedAt(clinic.getCreatedAt().toString());
        doctorVO.setClinic(clinicVO);
        return Result.success(doctorVO);
    }
}
