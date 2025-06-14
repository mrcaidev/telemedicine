package com.medical.records.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import com.medical.records.common.Result;
import com.medical.records.feign.AppointmentFeignClient;
import com.medical.records.feign.UserFeignClient;
import com.medical.records.model.dto.MedicalRecordCreateDTO;
import com.medical.records.model.dto.MedicalRecordQueryDTO;
import com.medical.records.model.dto.MedicalRecordUpdateDTO;
import com.medical.records.model.entity.MedicalRecord;
import com.medical.records.model.vo.AppointmentVO;
import com.medical.records.model.vo.MedicalRecordVO;
import com.medical.records.model.vo.MedicalRecordsVO;
import com.medical.records.model.vo.UserVO;
import com.medical.records.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@Validated
@Tag(name = "病例记录管理", description = "病例记录相关接口")
public class MedicalRecordController {
    @Resource
    private MedicalRecordService medicalRecordService;
    @Resource
    private UserFeignClient userFeignClient;
    @Resource
    private AppointmentFeignClient appointmentFeignClient;

    /**
     * 创建病例
     * @param record
     * @return
     */
    @PostMapping("/medical-records")
    @Operation(summary = "创建病历", description = "创建新的病历记录")
    public Result<MedicalRecordVO> create(@Valid @RequestBody MedicalRecordCreateDTO record,
                                          @RequestHeader(value = "X-User-Id",required = false) String userId,
                                          @RequestHeader(value = "X-User-Role",required = false) String role) {
        log.info("Received POST request to create medical-records. User ID: {}", userId);
        if(StrUtil.isEmpty(role)||!role.equals("doctor")){
            throw new RuntimeException("不是医生没有权限");
        }
        // 获取预约信息
        Result<AppointmentVO> appointmentVOResult = appointmentFeignClient.getAppointmentById("1",userId);
        if (appointmentVOResult.getCode() != 0 || appointmentVOResult.getData() == null) {
            throw new RuntimeException("预约id不存在");
        }
        record.setPatientId(appointmentVOResult.getData().getPatient().getId());

        MedicalRecordVO created = medicalRecordService.create(record);
        return Result.success(created);
    }

    /**
     * 更新病历部分字段
     * @param id
     * @param updatedFields
     * @return
     */
    @PatchMapping("/medical-records/{id}")
    @Operation(summary = "更新病历", description = "更新病历")
    public Result<MedicalRecord> update(
            @PathVariable String id, @RequestBody MedicalRecordUpdateDTO updatedFields,
            @RequestHeader(value = "X-User-Id",required = false) String userId,
            @RequestHeader(value = "X-User-Role",required = false) String role) {

        if(StrUtil.isEmpty(role)||!role.equals("doctor")){
            throw new RuntimeException("不是医生没有权限");
        }
        MedicalRecord updated = medicalRecordService.update(id, updatedFields);
        return Result.success(updated);
    }

    /**
     * 删除病例
     * @param id
     * @return
     */
    @DeleteMapping("/medical-records/{id}")
    @Operation(summary = "删除病例", description = "删除病例")
    public Result delete(@PathVariable String id,
                         @RequestHeader(value = "X-User-Id",required = false) String userId,
                         @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("doctor")){
            throw new RuntimeException("不是医生没有权限");
        }
        if(StrUtil.isBlank(id)){
            return Result.failed("id不能为空");
        }
        medicalRecordService.delete(id);
        return Result.success("ok");
    }

    /**
     * 查看单条病历
     * @param id
     * @return
     */
    @GetMapping("/medical-records/{id}")
    @Operation(summary = "查看单条病历", description = "查看单条病历")
    public Result<MedicalRecord> get(@PathVariable String id) {
        MedicalRecord record = medicalRecordService.getById(id);
        return Result.success(record);
    }

    /**
     * 获取患者病历列表（分⻚、
     * 排序）
     * @param patientId
     * @param
     * @return
     */
    @GetMapping("/medical-records")
    @Operation(summary = "获取患者病历列表", description = "获取患者病历列表")
    public Result<MedicalRecordsVO> getByPatientId(
            @Parameter(description = "病人ID") @RequestParam(required = false) String patientId,
            @Parameter(description = "每页大小") @RequestParam(required = false, defaultValue = "10") Integer limit,
            @Parameter(description = "游标") @RequestParam(required = false) String cursor,
            @Parameter(description = "按日期排序方式(asc/desc)") @RequestParam(required = false, defaultValue = "asc") String sort_date,
            @RequestHeader(value = "X-User-Id",required = false) String userId,
            @RequestHeader(value = "X-User-Role",required = false) String role) {
        MedicalRecordQueryDTO queryDTO = new MedicalRecordQueryDTO();
        queryDTO.setPatientId(patientId);
        queryDTO.setLimit(limit);
        queryDTO.setCursor(cursor);
        queryDTO.setSort_date(sort_date);
        List<MedicalRecordVO> records = medicalRecordService.listMedicalRecord(queryDTO, null);
        MedicalRecordsVO vo = new MedicalRecordsVO();
        vo.setMedicalRecords(records);
        if(CollectionUtil.isNotEmpty(records)){
            vo.setNextCursor(records.get(records.size()-1).getRecordDate().toString());
        }
        return Result.success(vo);
    }

    /**
     * 获取病例总结
     *
     * @param id
     * @return
     */
    @GetMapping("/medical-records/{id}/summary")
    @Operation(summary = "获取病例总结", description = "获取病例总结")
    public Result<String> getSummary(@PathVariable String id) {
        String summary = medicalRecordService.getSummary(id);
        return Result.success(summary);
    }
}
