package com.medical.record.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medical.record.common.ResultCode;
import com.medical.record.model.dto.MedicationQueryDTO;
import com.medical.record.model.entity.Medication;
import com.medical.record.service.MedicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MedicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MedicationService medicationService;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    // ============================== 查询测试 ==============================
    @Test
    public void testGetAll_WithAdminRoleAndValidParams() throws Exception {
        // 准备测试数据
        Medication medication1 = new Medication();
        medication1.setCode("M001");
        medication1.setName("阿司匹林");
        Medication medication2 = new Medication();
        medication2.setCode("M002");
        medication2.setName("布洛芬");
        List<Medication> medications = Arrays.asList(medication1, medication2);

        // 模拟Service返回数据
        MedicationQueryDTO queryDTO = new MedicationQueryDTO();
        queryDTO.setCode("M001");queryDTO.setLimit(10);
        queryDTO.setCursor("asc");
        when(medicationService.listMedication(queryDTO)).thenReturn(medications);

        // 发送带参数的GET请求（管理员角色）
        mockMvc.perform(get("/medications")
                        .param("code", "M001")
                        .param("limit", "10")
                        .param("sort_info", "asc")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.medications", hasSize(2))); // 预期返回2条数据
//                .andExpect(jsonPath("$.data.nextCursor", is("M002"))); // 期待游标为最后一条数据的code

        // 验证Service方法调用
        verify(medicationService, times(1)).listMedication(queryDTO);
    }

    @Test
    public void testGetAll_WithEmptyResult() throws Exception {
        // 模拟Service返回空列表
        when(medicationService.listMedication(ArgumentMatchers.any())).thenReturn(Collections.emptyList());

        // 发送请求（普通用户角色）
        mockMvc.perform(get("/medications")
                        .header("X-User-Id", "user_01")
                        .header("X-User-Role", "doctor")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.medications", hasSize(0))) // 预期返回空列表
                .andExpect(jsonPath("$.data.nextCursor").doesNotExist()); // 空结果无游标
    }

    // ============================== 创建测试 ==============================
    @Test
    public void testCreate_SuccessWithAdminRole() throws Exception {
        // 准备创建数据
        Medication newMedication = new Medication();
        newMedication.setCode("M003");
        newMedication.setName("布洛芬缓释胶囊");
        String requestBody = objectMapper.writeValueAsString(newMedication);

        // 模拟校验（编码不存在）
        when(medicationService.getById("M003")).thenReturn(null);
        when(medicationService.create(newMedication)).thenReturn(newMedication);

        // 发送POST请求（管理员角色）
        mockMvc.perform(post("/medications")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.code", is("M003")))
                .andExpect(jsonPath("$.data.name", is("布洛芬缓释胶囊")));

        // 验证调用链
        verify(medicationService, times(1)).getById("M003");
        verify(medicationService, times(1)).create(newMedication);
    }

    @Test
    public void testCreate_WithoutAdminRole() throws Exception {
        // 准备数据（非管理员角色）
        Medication newMedication = new Medication();
        newMedication.setCode("M003");
        newMedication.setName("布洛芬缓释胶囊");
        String requestBody = objectMapper.writeValueAsString(newMedication);

        // 发送请求（普通用户角色）
        mockMvc.perform(post("/medications")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "user_01")
                        .header("X-User-Role", "patient")) // 非管理员角色
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));

        // 验证Service未被调用
        verify(medicationService, never()).getById(anyString());
        verify(medicationService, never()).create(any());
    }

    @Test
    public void testCreate_DuplicateCode() throws Exception {
        // 准备重复数据
        Medication existingMedication = new Medication();
        existingMedication.setCode("M001");
        existingMedication.setName("阿司匹林");
        String requestBody = objectMapper.writeValueAsString(existingMedication);

        // 模拟编码已存在
        when(medicationService.getById("M001")).thenReturn(existingMedication);

        // 发送创建请求
        mockMvc.perform(post("/medications")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("已存在相同的编码")));
    }

    // ============================== 更新测试 ==============================
    @Test
    public void testUpdate_SuccessWithAdminRole() throws Exception {
        // 准备更新数据
        Medication updatedMedication = new Medication();
        updatedMedication.setCode("M001");
        updatedMedication.setName("阿司匹林肠溶片");
        String updateBody = objectMapper.writeValueAsString(updatedMedication);

        // 模拟更新逻辑
        when(medicationService.update("M001", updatedMedication)).thenReturn(updatedMedication);

        // 发送PATCH请求（管理员角色）
        mockMvc.perform(patch("/medications/M001")
                        .content(updateBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.name", is("阿司匹林肠溶片")));
    }

    @Test
    public void testUpdate_WithoutAdminRole() throws Exception {
        // 准备更新数据
        Medication updatedMedication = new Medication();
        updatedMedication.setCode("M001");
        updatedMedication.setName("阿司匹林肠溶片");
        String updateBody = objectMapper.writeValueAsString(updatedMedication);

        // 发送PATCH请求（非管理员角色）
        mockMvc.perform(patch("/medications/M001")
                        .content(updateBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "user_01")
                        .header("X-User-Role", "doctor"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));

        // 验证Service未被调用
        verify(medicationService, never()).update(anyString(), any());
    }

    // ============================== 删除测试 ==============================
    @Test
    public void testDelete_SuccessWithAdminRole() throws Exception {
        // 发送DELETE请求（管理员角色）
        mockMvc.perform(delete("/medications/M001")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data", is("ok")));

        // 验证删除方法调用
        verify(medicationService, times(1)).delete("M001");
    }

    @Test
    public void testDelete_WithoutAdminRole() throws Exception {
        // 发送DELETE请求（非管理员角色）
        mockMvc.perform(delete("/medications/M001")
                        .header("X-User-Id", "user_01")
                        .header("X-User-Role", "patient"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));

        // 验证Service未被调用
        verify(medicationService, never()).delete(anyString());
    }

    // ============================== 异常测试 ==============================
    @Test
    public void testCreate_ThrowsException() throws Exception {
        // 准备数据
        Medication newMedication = new Medication();
        newMedication.setCode("M009");
        newMedication.setName("测试药物");
        String requestBody = objectMapper.writeValueAsString(newMedication);

        // 模拟Service抛出异常
        when(medicationService.getById("M009")).thenReturn(null);
        doThrow(new RuntimeException("数据库异常")).when(medicationService).create(newMedication);

        // 发送请求
        mockMvc.perform(post("/medications")
                        .content(requestBody)
                        .header("X-User-Role", "platform_admin")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())));
    }
}