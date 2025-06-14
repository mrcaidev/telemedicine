package com.medical.record.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import com.medical.record.common.Result;
import com.medical.record.feign.UserFeignClient;
import com.medical.record.model.dto.MedicationQueryDTO;
import com.medical.record.model.entity.Medication;
import com.medical.record.model.vo.MedicationsVO;
import com.medical.record.service.MedicationService;
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
@Tag(name = "药品管理", description = "药品管理相关接口")
public class MedicationController {
    @Resource
    private MedicationService medicationService;
    @Resource
    private UserFeignClient userFeignClient;

    /**
     *获取药品列表
     * @return
     */
    @GetMapping("/medications")
    @Operation(summary = "获取药品列表", description = "获取药品列表")
    public Result<MedicationsVO> getAll(@Parameter(description = "编码") @RequestParam(required = false) String code,
                                           @Parameter(description = "描述") @RequestParam(required = false) String name,
                                           @Parameter(description = "每页大小") @RequestParam(required = false, defaultValue = "10") Integer limit,
                                           @Parameter(description = "游标") @RequestParam(required = false) String cursor,
                                           @Parameter(description = "按code排序方式(asc/desc)") @RequestParam(required = false, defaultValue = "asc") String sort_info,
                                           @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
                                        @RequestHeader(value = "X-User-Role",required = false) String role) {

        MedicationQueryDTO queryDTO = new MedicationQueryDTO();
        queryDTO.setCode(code);
        queryDTO.setName(name);
        queryDTO.setLimit(limit);
        queryDTO.setCursor(sort_info);
        List<Medication> medicationList = medicationService.listMedication(queryDTO);
        MedicationsVO vo = new MedicationsVO();
        vo.setMedications(medicationList);
        if(CollectionUtil.isNotEmpty(medicationList)){
            vo.setNextCursor(medicationList.get(medicationList.size()-1).getCode().toString());
        }
        return Result.success(vo);
    }
//    public Result<List<Medication>> getAll() {
//        List<Medication> medications = medicationService.getAll();
//        return Result.success(medications);
//    }

    /**
     *创建药品项
     * @return
     */
    @PostMapping("/medications")
    @Operation(summary = "创建药品项", description = "创建药品项")
    public Result<Medication> create(@Valid @RequestBody Medication medication,
                                     @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
                                     @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        Medication origin = medicationService.getById(medication.getCode());
        if(null!=origin){
            throw new RuntimeException("已存在相同的编码");
        }
        Medication created = medicationService.create(medication);
        return Result.success(created);
    }

    /**
     *更新药品项
     * @return
     */
    @PatchMapping("/medications/{code}")
    @Operation(summary = "更新药品项", description = "更新药品项")
    public Result<Medication> update(
            @PathVariable String code, @RequestBody Medication updatedFields,
            @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        Medication updated = medicationService.update(code, updatedFields);
        return Result.success(updated);
    }

    /**
     *删除药品项
     * @return
     */
    @DeleteMapping("/medications/{code}")
    @Operation(summary = "删除药品项", description = "删除药品项")
    public Result delete(@PathVariable String code,
                         @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
                         @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        medicationService.delete(code);
        return Result.success("ok");
    }
}
