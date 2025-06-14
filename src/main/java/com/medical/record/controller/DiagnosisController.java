package com.medical.record.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import com.medical.record.common.Result;
import com.medical.record.feign.UserFeignClient;
import com.medical.record.model.dto.DiagnosisQueryDTO;
import com.medical.record.model.entity.Diagnosis;
import com.medical.record.model.vo.DiagnosissVO;
import com.medical.record.service.DiagnosisService;
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
@Tag(name = "诊断管理", description = "诊断管理相关接口")
public class DiagnosisController {
    @Resource
    private DiagnosisService diagnosisService;
    @Resource
    private UserFeignClient userFeignClient;

    /**
     *获取诊断列表
     * @return
     */
    @GetMapping("/diagnoses")
    @Operation(summary = "获取诊断列表", description = "获取诊断列表")
    public Result<DiagnosissVO> pageDiagnoses(
            @Parameter(description = "编码") @RequestParam(required = false) String code,
            @Parameter(description = "描述") @RequestParam(required = false) String description,
            @Parameter(description = "每页大小") @RequestParam(required = false, defaultValue = "10") Integer limit,
            @Parameter(description = "游标") @RequestParam(required = false) String cursor,
            @Parameter(description = "按code排序方式(asc/desc)") @RequestParam(required = false, defaultValue = "asc") String sort_info,
            @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Role",required = false) String role
    ) {
        DiagnosisQueryDTO queryDTO = new DiagnosisQueryDTO();
        queryDTO.setCode(code);
        queryDTO.setDescription(description);
        queryDTO.setLimit(limit);
        queryDTO.setCursor(sort_info);
        List<Diagnosis> diagnoses = diagnosisService.listDiagnosis(queryDTO);
        DiagnosissVO vo = new DiagnosissVO();
        vo.setDiagnosiss(diagnoses);
        if(CollectionUtil.isNotEmpty(diagnoses)){
            vo.setNextCursor(diagnoses.get(diagnoses.size()-1).getCode().toString());
        }
        return Result.success(vo);
    }

    /**
     *创建诊断项
     * @param diagnosis
     * @return
     */
    @PostMapping("/diagnoses")
    @Operation(summary = "创建诊断项", description = "创建诊断项")
    public Result<Diagnosis> create(@Valid @RequestBody Diagnosis diagnosis,
                                    @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
                                    @RequestHeader(value = "X-User-Role",required = false) String role) {

        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        Diagnosis origin = diagnosisService.getById(diagnosis.getCode());
        if(null!=origin){
            throw new RuntimeException("已存在相同的编码");
        }
        Diagnosis created = diagnosisService.create(diagnosis);
        return Result.success(created);
    }

    /**
     *更新诊断项
     * @param code
     * @param updatedFields
     * @return
     */
    @PatchMapping("/diagnoses/{code}")
    @Operation(summary = "更新诊断项", description = "更新诊断项")
    public Result update(
            @PathVariable String code, @RequestBody Diagnosis updatedFields,
            @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        Diagnosis updated = diagnosisService.update(code, updatedFields);
        return Result.success(updated);

    }

    /**
     *删除诊断项
     * @param code
     * @return
     */
    @DeleteMapping("/diagnoses/{code}")
    @Operation(summary = "删除诊断项", description = "删除诊断项")
    public Result delete(@PathVariable String code,
                         @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
                         @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        diagnosisService.delete(code);
        return Result.success("ok");
    }
}
