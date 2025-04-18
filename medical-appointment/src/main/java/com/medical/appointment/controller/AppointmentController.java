package com.medical.appointment.controller;

import com.medical.appointment.common.Result;
import com.medical.appointment.model.dto.AppointmentCreateDTO;
import com.medical.appointment.model.dto.AppointmentQueryDTO;
import com.medical.appointment.model.vo.AppointmentVO;
import com.medical.appointment.model.vo.PageResult;
import com.medical.appointment.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 预约控制器
 */
@Slf4j
@RestController
@Validated
@Tag(name = "预约管理", description = "预约相关接口")
public class AppointmentController {

    @Resource
    private AppointmentService appointmentService;

    /**
     * 创建预约
     *
     * @param dto   预约创建DTO
     * @param userId 用户ID（从JWT中获取）
     * @param token 认证令牌
     * @return 预约详情
     */
    @PostMapping("/appointments")
    @Operation(summary = "创建预约", description = "创建新的预约记录")
    public Result<AppointmentVO> createAppointment(
            @Valid @RequestBody AppointmentCreateDTO dto,
            @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-ID") String userId,
            @Parameter(description = "认证令牌", hidden = true) @RequestHeader("Authorization") String token) {
        AppointmentVO appointmentVO = appointmentService.createAppointment(dto, userId, token);
        return Result.success(appointmentVO);
    }

    /**
     * 查询预约列表
     *
     * @param doctorId   医生ID
     * @param patientId  病人ID
     * @param startDate  开始日期
     * @param endDate    结束日期
     * @param status     状态
     * @param limit      每页大小
     * @param cursor     游标
     * @param sort_date  排序方式
     * @param userId     用户ID（从JWT中获取）
     * @param token      认证令牌
     * @return 预约列表
     */
    @GetMapping("/appointments")
    @Operation(summary = "查询预约列表", description = "分页查询预约列表")
    public Result<List<AppointmentVO>> listAppointments(
            @Parameter(description = "医生ID") @RequestParam(required = false) String doctorId,
            @Parameter(description = "病人ID") @RequestParam(required = false) String patientId,
            @Parameter(description = "开始日期") @RequestParam(required = false) LocalDate startDate,
            @Parameter(description = "结束日期") @RequestParam(required = false) LocalDate endDate,
            @Parameter(description = "状态") @RequestParam(required = false) String status,
            @Parameter(description = "每页大小") @RequestParam(required = false, defaultValue = "10") Integer limit,
            @Parameter(description = "游标") @RequestParam(required = false) String cursor,
            @Parameter(description = "按日期排序方式(asc/desc)") @RequestParam(required = false, defaultValue = "asc") String sort_date,
            @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-ID") String userId,
            @Parameter(description = "认证令牌", hidden = true) @RequestHeader("Authorization") String token) {
        
        AppointmentQueryDTO queryDTO = new AppointmentQueryDTO();
        queryDTO.setDoctorId(doctorId);
        queryDTO.setPatientId(patientId);
        queryDTO.setStartDate(startDate);
        queryDTO.setEndDate(endDate);
        queryDTO.setStatus(status);
        queryDTO.setLimit(limit);
        queryDTO.setCursor(cursor);
        queryDTO.setSort_date(sort_date);

        // 病人只能查询自己的预约，医生只能查询自己的预约
        // 如果前端没有传递patientId或doctorId，就使用当前用户的ID
        if (doctorId == null && patientId == null) {
            // 如果都为空，则默认查询与当前用户相关的预约
            queryDTO.setPatientId(userId);
        }

        List<AppointmentVO> appointmentList = appointmentService.listAppointments(queryDTO, token);
        return Result.success(appointmentList);
    }

    /**
     * 获取预约详情
     *
     * @param id     预约ID
     * @param userId 用户ID（从JWT中获取）
     * @param token  认证令牌
     * @return 预约详情
     */
    @GetMapping("/appointments/{id}")
    @Operation(summary = "获取预约详情", description = "获取指定预约的详细信息")
    public Result<AppointmentVO> getAppointmentById(
            @Parameter(description = "预约ID") @PathVariable String id,
            @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-ID") String userId,
            @Parameter(description = "认证令牌", hidden = true) @RequestHeader("Authorization") String token) {
        AppointmentVO appointmentVO = appointmentService.getAppointmentById(id, userId, token);
        return Result.success(appointmentVO);
    }

    /**
     * 取消预约
     *
     * @param id     预约ID
     * @param userId 用户ID（从JWT中获取）
     * @param token  认证令牌
     * @return 预约详情
     */
    @PutMapping("/appointments/{id}/cancel")
    @Operation(summary = "取消预约", description = "取消指定的预约")
    public Result<AppointmentVO> cancelAppointment(
            @Parameter(description = "预约ID") @PathVariable String id,
            @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-ID") String userId,
            @Parameter(description = "认证令牌", hidden = true) @RequestHeader("Authorization") String token) {
        AppointmentVO appointmentVO = appointmentService.cancelAppointment(id, userId, token);
        return Result.success(appointmentVO);
    }
}