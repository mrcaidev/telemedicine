package com.medical.record.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medical.record.common.ResultCode;
import com.medical.record.model.entity.Diagnosis;
import com.medical.record.service.DiagnosisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest
@AutoConfigureMockMvc
//@WebMvcTest(DiagnosisController.class)
public class DiagnosisControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DiagnosisService diagnosisService;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void testPageDiagnoses_WithAdminRole() throws Exception {
        // 准备测试数据
        Diagnosis diagnosis1 = new Diagnosis();
        diagnosis1.setCode("C001");
        diagnosis1.setDescription("感冒");

        Diagnosis diagnosis2 = new Diagnosis();
        diagnosis2.setCode("C002");
        diagnosis2.setDescription("发烧");

        List<Diagnosis> diagnoses = Arrays.asList(diagnosis1, diagnosis2);

        // 设置mock行为
        when(diagnosisService.listDiagnosis(any())).thenReturn(diagnoses);

        // 执行请求
        mockMvc.perform(get("/diagnoses")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.diagnosis", hasSize(2)))
                .andExpect(jsonPath("$.data.diagnosis[0].code", is("C001")))
                .andExpect(jsonPath("$.data.diagnosis[1].code", is("C002")))
                .andExpect(jsonPath("$.data.nextCursor", is("C002")));

        // 验证服务方法调用
        verify(diagnosisService, times(1)).listDiagnosis(any());
    }

    @Test
    public void testPageDiagnoses_WithEmptyResult() throws Exception {
        // 设置mock行为
        when(diagnosisService.listDiagnosis(any())).thenReturn(Collections.emptyList());

        // 执行请求
        mockMvc.perform(get("/diagnoses")
                        .header("X-User-Id", "user")
                        .header("X-User-Role", "doctor")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.diagnosis", hasSize(0)))
                .andExpect(jsonPath("$.data.nextCursor").doesNotExist());

        // 验证服务方法调用
        verify(diagnosisService, times(1)).listDiagnosis(any());
    }

    @Test
    public void testCreateDiagnosis_Success() throws Exception {
        // 准备测试数据
        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setCode("C001");
        diagnosis.setDescription("感冒");

        // 设置mock行为
        when(diagnosisService.getById("C001")).thenReturn(null);
        when(diagnosisService.create(any())).thenReturn(diagnosis);

        // 执行请求
        mockMvc.perform(post("/diagnoses")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin")
                        .content(objectMapper.writeValueAsString(diagnosis))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.code", is("C001")))
                .andExpect(jsonPath("$.data.description", is("感冒")));

        // 验证服务方法调用
        verify(diagnosisService, times(1)).getById("C001");
        verify(diagnosisService, times(1)).create(any());
    }

    @Test
    public void testCreateDiagnosis_WithoutAdminRole() throws Exception {
        // 准备测试数据
        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setCode("C001");
        diagnosis.setDescription("感冒");

        // 执行请求（不带管理员角色）
        mockMvc.perform(post("/diagnoses")
                        .header("X-User-Id", "user")
                        .content(objectMapper.writeValueAsString(diagnosis))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));

        // 验证服务方法未被调用
        verify(diagnosisService, never()).getById(anyString());
        verify(diagnosisService, never()).create(any());
    }

    @Test
    public void testCreateDiagnosis_AlreadyExists() throws Exception {
        // 准备测试数据
        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setCode("C001");
        diagnosis.setDescription("感冒");

        // 设置mock行为（已存在的诊断）
        when(diagnosisService.getById("C001")).thenReturn(diagnosis);

        // 执行请求
        mockMvc.perform(post("/diagnoses")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin")
                        .content(objectMapper.writeValueAsString(diagnosis))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("已存在相同的编码")));

        // 验证服务方法调用
        verify(diagnosisService, times(1)).getById("C001");
        verify(diagnosisService, never()).create(any());
    }

    @Test
    public void testUpdateDiagnosis_Success() throws Exception {
        // 准备测试数据
        Diagnosis updatedDiagnosis = new Diagnosis();
        updatedDiagnosis.setCode("C001");
        updatedDiagnosis.setDescription("重感冒");

        // 设置mock行为
        when(diagnosisService.update(eq("C001"), any())).thenReturn(updatedDiagnosis);

        // 执行请求
        mockMvc.perform(patch("/diagnoses/C001")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin")
                        .content("{\"description\":\"重感冒\"}")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.code", is("C001")))
                .andExpect(jsonPath("$.data.description", is("重感冒")));

        // 验证服务方法调用
        verify(diagnosisService, times(1)).update(eq("C001"), any());
    }

    @Test
    public void testUpdateDiagnosis_WithoutAdminRole() throws Exception {
        // 执行请求（不带管理员角色）
        mockMvc.perform(patch("/diagnoses/C001")
                        .header("X-User-Id", "user")
                        .content("{\"description\":\"重感冒\"}")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));

        // 验证服务方法未被调用
        verify(diagnosisService, never()).update(anyString(), any());
    }

    @Test
    public void testDeleteDiagnosis_Success() throws Exception {
        // 执行请求
        mockMvc.perform(delete("/diagnoses/C001")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data", is("ok")));

        // 验证服务方法调用
        verify(diagnosisService, times(1)).delete("C001");
    }

    @Test
    public void testDeleteDiagnosis_WithoutAdminRole() throws Exception {
        // 执行请求（不带管理员角色）
        mockMvc.perform(delete("/diagnoses/C001")
                        .header("X-User-Id", "user")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));

        // 验证服务方法未被调用
        verify(diagnosisService, never()).delete(anyString());
    }

    @Test
    public void testPageDiagnoses_WithParameters() throws Exception {
        // 准备测试数据
        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setCode("C001");
        diagnosis.setDescription("感冒");

        List<Diagnosis> diagnoses = Collections.singletonList(diagnosis);

        // 设置mock行为
        when(diagnosisService.listDiagnosis(any())).thenReturn(diagnoses);

        // 执行请求，带查询参数
        mockMvc.perform(get("/diagnoses")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin")
                        .param("code", "C001")
                        .param("description", "感冒")
                        .param("limit", "10")
                        .param("sort_info", "desc")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.diagnosis", hasSize(1)))
                .andExpect(jsonPath("$.data.diagnosis[0].code", is("C001")));

        // 验证服务方法调用
        verify(diagnosisService, times(1)).listDiagnosis(any());
    }
}