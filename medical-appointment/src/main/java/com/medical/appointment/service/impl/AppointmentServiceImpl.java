package com.medical.appointment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.appointment.common.Result;
import com.medical.appointment.common.ResultCode;
import com.medical.appointment.feign.UserFeignClient;
import com.medical.appointment.model.dto.AppointmentCreateDTO;
import com.medical.appointment.model.dto.AppointmentQueryDTO;
import com.medical.appointment.model.entity.Appointment;
import com.medical.appointment.model.vo.AppointmentVO;
import com.medical.appointment.model.vo.DoctorVO;
import com.medical.appointment.model.vo.PatientVO;
import com.medical.appointment.repository.AppointmentRepository;
import com.medical.appointment.service.AppointmentService;
import com.medical.appointment.service.KafkaMessageService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * 预约服务实现类
 */
@Slf4j
@Service
public class AppointmentServiceImpl extends ServiceImpl<AppointmentRepository, Appointment> implements AppointmentService {

    @Resource
    private UserFeignClient userFeignClient;

    @Autowired
    private KafkaMessageService kafkaMessageService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AppointmentVO createAppointment(AppointmentCreateDTO dto, String patientId, String token) {
        // 获取医生信息
        Result<DoctorVO> doctorResult = userFeignClient.getDoctorById(dto.getDoctorId(), token);
        if (doctorResult.getCode() != 200 || doctorResult.getData() == null) {
            throw new RuntimeException("医生不存在");
        }

        // 获取病人信息
        Result<PatientVO> patientResult = userFeignClient.getUserById(patientId, token);
        if (patientResult.getCode() != 200 || patientResult.getData() == null) {
            throw new RuntimeException("病人不存在");
        }

        // 创建预约
        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(dto.getDoctorId());
//        appointment.setDate(dto.getDate());
//        appointment.setStartTime(LocalTime.parse(dto.getStartTime()));
//        appointment.setEndTime(LocalTime.parse(dto.getEndTime()));

        appointment.setStartAt(strTOLocalDateTime(dto.getStartAt()));
        appointment.setEndAt(strTOLocalDateTime(dto.getEndAt()));
        appointment.setRemark(dto.getRemark());
        appointment.setStatus("normal");
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());

        // 保存预约
        boolean success = save(appointment);
        if (!success) {
            throw new RuntimeException("创建预约失败");
        }

        // 发送预约创建消息
//        kafkaMessageService.sendAppointmentCreatedMessage(
//            patientId,
//            appointment.getId(),
//            "预约创建成功",
//            String.format("您的预约已成功创建，预约时间：%s", appointment.getDate().format(DateTimeFormatter.ofPattern("HH:mm")))
//        );

        // 转换为视图对象
        return convertToVO(appointment, patientResult.getData(), doctorResult.getData());
    }

    public static LocalDateTime strTOLocalDateTime(String str){
        return OffsetDateTime.parse(str,DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime();
    }

    @Override
    public List<AppointmentVO> listAppointments(AppointmentQueryDTO dto, String token) {
        LambdaQueryWrapper<Appointment> queryWrapper = new LambdaQueryWrapper<>();

        // 根据医生ID过滤
        if (dto.getDoctorId() != null && !dto.getDoctorId().isEmpty()) {
            queryWrapper.eq(Appointment::getDoctorId, dto.getDoctorId());
        }

        // 根据病人ID过滤
        if (dto.getPatientId() != null && !dto.getPatientId().isEmpty()) {
            queryWrapper.eq(Appointment::getPatientId, dto.getPatientId());
        }

        // 根据开始日期过滤
        if (dto.getStartDate() != null) {
            queryWrapper.ge(Appointment::getStartAt, dto.getStartDate());
        }

        // 根据结束日期过滤
        if (dto.getEndDate() != null) {
            queryWrapper.le(Appointment::getEndAt, dto.getEndDate());
        }

        // 根据状态过滤
        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            queryWrapper.eq(Appointment::getStatus, dto.getStatus());
        }

        // 处理游标
        if (dto.getCursor() != null && !dto.getCursor().isEmpty()) {
            if ("asc".equalsIgnoreCase(dto.getSort_date())) {
                queryWrapper.gt(Appointment::getStartAt, dto.getCursor());
            } else {
                queryWrapper.lt(Appointment::getStartAt, dto.getCursor());
            }
        }

        // 设置排序
        if ("asc".equalsIgnoreCase(dto.getSort_date())) {
            queryWrapper.orderByAsc(Appointment::getEndAt, Appointment::getStartAt);
        } else {
            queryWrapper.orderByDesc(Appointment::getEndAt, Appointment::getStartAt);
        }

        // 限制查询条数
        queryWrapper.last("LIMIT " + dto.getLimit());

        // 查询预约列表
        List<Appointment> appointments = list(queryWrapper);

        // 转换为视图对象
        List<AppointmentVO> voList = new ArrayList<>();
        for (Appointment appointment : appointments) {
            Result<PatientVO> patientResult = userFeignClient.getUserById(appointment.getPatientId(), token);
            Result<DoctorVO> doctorResult = userFeignClient.getDoctorById(appointment.getDoctorId(), token);

            if (patientResult.getCode() == 200 && doctorResult.getCode() == 200) {
                AppointmentVO vo = convertToVO(appointment, patientResult.getData(), doctorResult.getData());
                voList.add(vo);
            }
        }

        return voList;
    }

    @Override
    public AppointmentVO getAppointmentById(String id, String userId, String token) {
        // 查询预约
        Appointment appointment = getById(id);
        if (appointment == null) {
            throw new RuntimeException(ResultCode.NOT_FOUND.getMessage());
        }

        // 校验权限
//        if (!Objects.equals(appointment.getPatientId(), userId) && !Objects.equals(appointment.getDoctorId(), userId)) {
//            throw new RuntimeException(ResultCode.FORBIDDEN.getMessage());
//        }

        // 获取病人和医生信息
        Result<PatientVO> patientResult = userFeignClient.getUserById(appointment.getPatientId(), token);
        Result<DoctorVO> doctorResult = userFeignClient.getDoctorById(appointment.getDoctorId(), token);

        if (patientResult.getCode() != 200 || doctorResult.getCode() != 200) {
            throw new RuntimeException("获取用户信息失败");
        }

        // 转换为视图对象
        return convertToVO(appointment, patientResult.getData(), doctorResult.getData());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public AppointmentVO cancelAppointment(String id, String userId, String token) {
        // 查询预约
        Appointment appointment = getById(id);
        if (appointment == null) {
            throw new RuntimeException(ResultCode.NOT_FOUND.getMessage());
        }

        // 校验权限
        if (!Objects.equals(appointment.getPatientId(), userId) && !Objects.equals(appointment.getDoctorId(), userId)) {
            throw new RuntimeException(ResultCode.FORBIDDEN.getMessage());
        }

        // 校验状态
        if ("cancelled".equals(appointment.getStatus())) {
            throw new RuntimeException("预约已取消");
        }

        // 更新状态
        appointment.setStatus("cancelled");
        appointment.setUpdatedAt(LocalDateTime.now());
        boolean success = updateById(appointment);
        if (!success) {
            throw new RuntimeException("取消预约失败");
        }

        // 发送预约取消消息
//        kafkaMessageService.sendAppointmentCancelledMessage(
//            userId,
//            id,
//            "预约已取消",
//            "您的预约已成功取消"
//        );

        // 获取病人和医生信息
        Result<PatientVO> patientResult = userFeignClient.getUserById(appointment.getPatientId(), token);
        Result<DoctorVO> doctorResult = userFeignClient.getDoctorById(appointment.getDoctorId(), token);

        if (patientResult.getCode() != 200 || doctorResult.getCode() != 200) {
            throw new RuntimeException("获取用户信息失败");
        }

        // 转换为视图对象
        return convertToVO(appointment, patientResult.getData(), doctorResult.getData());
    }

    /**
     * 将预约实体转换为视图对象
     *
     * @param appointment 预约实体
     * @param patient 病人信息
     * @param doctor 医生信息
     * @return 预约视图对象
     */
    private AppointmentVO convertToVO(Appointment appointment, PatientVO patient, DoctorVO doctor) {
        AppointmentVO vo = new AppointmentVO();
        vo.setId(appointment.getId());
        vo.setPatient(patient);
        vo.setDoctor(doctor);
//        vo.setDate(appointment.getDate());
//        vo.setStartTime(appointment.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")));
//        vo.setEndTime(appointment.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        vo.setStartAt(appointment.getStartAt().toString());
        vo.setEndAt(appointment.getEndAt().toString());
        vo.setRemark(appointment.getRemark());
        vo.setStatus(appointment.getStatus());
        vo.setCreatedAt(appointment.getCreatedAt());
        return vo;
    }
}
