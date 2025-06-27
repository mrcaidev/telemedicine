package com.medical.record.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import com.medical.record.common.Result;
import com.medical.record.feign.UserFeignClient;
import com.medical.record.model.dto.LabTestQueryDTO;
import com.medical.record.model.entity.LabTest;
import com.medical.record.model.vo.LabTestsVO;
import com.medical.record.service.LabTestService;
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
@Tag(name = "检查项目管理", description = "检查项目管理相关接口")
public class LabTestController {
    @Resource
    private LabTestService labTestService;
    @Resource
    private UserFeignClient userFeignClient;

    /**
     *获取检查项⽬列表
     * @return
     */
    @GetMapping("/lab-tests")
    @Operation(summary = "获取检查项目列表", description = "获取检查项目列表")
    public Result<LabTestsVO> getAll(@Parameter(description = "编码") @RequestParam(required = false) String code,
                                     @Parameter(description = "描述") @RequestParam(required = false) String name,
                                     @Parameter(description = "每页大小") @RequestParam(required = false, defaultValue = "10") Integer limit,
                                     @Parameter(description = "游标") @RequestParam(required = false) String cursor,
                                     @Parameter(description = "按code排序方式(asc/desc)") @RequestParam(required = false, defaultValue = "asc") String sort_info,
                                     @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
                                     @RequestHeader(value = "X-User-Role",required = false) String role) {

        LabTestQueryDTO queryDTO = new LabTestQueryDTO();
        queryDTO.setCode(code);
        queryDTO.setName(name);
        queryDTO.setLimit(limit);
        queryDTO.setCursor(sort_info);
        List<LabTest> labTestList = labTestService.listLabTest(queryDTO);
        LabTestsVO vo = new LabTestsVO();
        vo.setLabTests(labTestList);
        if(CollectionUtil.isNotEmpty(labTestList)){
            vo.setNextCursor(labTestList.get(labTestList.size()-1).getCode().toString());
        }
        return Result.success(vo);
    }


    /**
     *创建检查项
     * @return
     */
    @PostMapping("/lab-tests")
    @Operation(summary = "创建检查项目", description = "创建检查项目")
    public Result<LabTest> create(@Valid @RequestBody LabTest labTest,
                                  @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
                                  @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        LabTest origin = labTestService.getById(labTest.getCode());
        if(null!=origin){
            throw new RuntimeException("已存在相同的编码");
        }
        LabTest created = labTestService.create(labTest);
        return Result.success(created);
    }

    /**
     *更新检查项⽬
     * @return
     */
    @PatchMapping("/lab-tests/{code}")
    @Operation(summary = "更新检查项⽬", description = "更新检查项⽬")
    public Result<LabTest> update(
            @PathVariable String code, @RequestBody LabTest updatedFields,
            @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
            @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        LabTest updated = labTestService.update(code, updatedFields);
        return Result.success(updated);
    }

    /**
     *删除检查项⽬
     * @return
     */
    @DeleteMapping("/lab-tests/{code}")
    @Operation(summary = "删除检查项⽬", description = "删除检查项⽬")
    public Result delete(@PathVariable String code,
                         @Parameter(description = "用户ID", hidden = true) @RequestHeader("X-User-Id") String userId,
                         @RequestHeader(value = "X-User-Role",required = false) String role) {
        if(StrUtil.isEmpty(role)||!role.equals("platform_admin")){
            throw new RuntimeException("不是管理员没有权限");
        }
        labTestService.delete(code);
        return Result.success("ok");
    }
}
