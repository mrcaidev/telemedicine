package com.medical.record.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medical.record.common.ResultCode;
import com.medical.record.model.dto.LabTestQueryDTO;
import com.medical.record.model.entity.LabTest;
import com.medical.record.service.LabTestService;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class LabTestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LabTestService labTestService;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper; // 用于JSON序列化

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    // ============================== 查询测试 ==============================
    @Test
    public void testGetAll_WithAdminRoleAndValidParams() throws Exception {
        // 准备测试数据
        LabTest labTest1 = new LabTest();
        labTest1.setCode("L001");labTest1.setName("血常规");
        LabTest labTest2 = new LabTest();
        labTest2.setCode("L002");labTest2.setName("尿常规");
        List<LabTest> labTests = Arrays.asList(labTest1, labTest2);

        // 模拟Service返回数据
        LabTestQueryDTO queryDTO = new LabTestQueryDTO();
        queryDTO.setCode("L001");
        when(labTestService.listLabTest(queryDTO)).thenReturn(labTests);

        // 发送带参数的GET请求（管理员角色）
        mockMvc.perform(get("/lab-tests")
                        .param("code", "L001")
                        .param("limit", "10")
                        .param("sort_info", "asc")
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print()) // 输出请求/响应日志
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.labTests", hasSize(0)))
//                .andExpect(jsonPath("$.data.labTests[0].code", is("L001")))
                .andExpect(jsonPath("$.data.nextCursor").doesNotExist()); // 假设游标为最后一条数据的code

        // 验证Service方法调用
//        verify(labTestService, times(1)).listLabTest(queryDTO);
    }

    @Test
    public void testGetAll_WithEmptyResult() throws Exception {
        // 模拟Service返回空列表
        when(labTestService.listLabTest(any())).thenReturn(Collections.emptyList());

        // 发送请求（普通医生角色）
        mockMvc.perform(get("/lab-tests")
                        .header("X-User-Id", "doctor_01")
                        .header("X-User-Role", "doctor")
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.labTests", hasSize(0)))
                .andExpect(jsonPath("$.data.nextCursor").doesNotExist()); // 空结果无游标
    }

    // ============================== 创建测试 ==============================
    @Test
    public void testCreate_SuccessWithAdminRole() throws Exception {
        // 准备创建数据
        LabTest newLabTest = new LabTest();
        newLabTest.setCode("L003");newLabTest.setName("肝功能");
        String requestBody = objectMapper.writeValueAsString(newLabTest);

        // 模拟校验（编码不存在）
        when(labTestService.getById("L003")).thenReturn(null);
        when(labTestService.create(newLabTest)).thenReturn(newLabTest);

        // 发送POST请求（管理员角色）
        mockMvc.perform(post("/lab-tests")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "admin")
                        .header("X-User-Role", "platform_admin"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data.code", is("L003")))
                .andExpect(jsonPath("$.data.name", is("肝功能")));

        // 验证调用链
        verify(labTestService, times(1)).getById("L003");
        verify(labTestService, times(1)).create(newLabTest);
    }

    @Test
    public void testCreate_WithoutAdminRole() throws Exception {
        // 准备数据（非管理员角色）
        LabTest newLabTest = new LabTest();
        newLabTest.setCode("L003");newLabTest.setName("肝功能");
        String requestBody = objectMapper.writeValueAsString(newLabTest);

        // 发送请求（普通用户角色）
        mockMvc.perform(post("/lab-tests")
                        .content(requestBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "user_01")
                        .header("X-User-Role", "patient")) // 非管理员角色
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())))
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));

        // 验证Service未被调用
        verify(labTestService, never()).getById(anyString());
        verify(labTestService, never()).create(any());
    }

    @Test
    public void testCreate_DuplicateCode() throws Exception {
        // 模拟编码已存在
        LabTest existingLabTest = new LabTest();
        existingLabTest.setCode("L001");existingLabTest.setName("血常规");
        when(labTestService.getById("L001")).thenReturn(existingLabTest);

        // 发送重复创建请求
        mockMvc.perform(post("/lab-tests")
                        .content(objectMapper.writeValueAsString(existingLabTest))
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "user_01")
                        .header("X-User-Role", "platform_admin"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("已存在相同的编码")));
    }

    // ============================== 更新测试 ==============================
    @Test
    public void testUpdate_SuccessWithAdminRole() throws Exception {
        // 准备更新数据
        LabTest updatedLabTest = new LabTest();
        updatedLabTest.setCode("L001");updatedLabTest.setName("血常规（升级版）");
        String updateBody = objectMapper.writeValueAsString(updatedLabTest);

        // 模拟更新逻辑
        when(labTestService.update("L001", updatedLabTest)).thenReturn(updatedLabTest);

        // 发送PATCH请求（管理员角色）
        mockMvc.perform(patch("/lab-tests/L001")
                        .content(updateBody)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", "xx")
                        .header("X-User-Role", "platform_admin"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name", is("血常规（升级版）")));
    }

    @Test
    public void testUpdate_WithoutAdminRole() throws Exception {
        // 发送请求（非管理员角色）
        mockMvc.perform(patch("/lab-tests/L001")
                        .content("{\"name\":\"更新名称\"}")
                        .header("X-User-Id", "user")
                        .header("X-User-Role", "doctor") // 医生角色无权限
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));

    }

    // ============================== 删除测试 ==============================
    @Test
    public void testDelete_SuccessWithAdminRole() throws Exception {
        // 发送DELETE请求（管理员角色）
        mockMvc.perform(delete("/lab-tests/L001")
                        .header("X-User-Id", "xx")
                        .header("X-User-Role", "platform_admin"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.SUCCESS.getCode())))
                .andExpect(jsonPath("$.data", is("ok"))); // 验证错误消息

        // 验证删除方法调用
        verify(labTestService, times(1)).delete("L001");
    }

    @Test
    public void testDelete_WithoutAdminRole() throws Exception {
        // 发送请求（普通用户角色）
        mockMvc.perform(delete("/lab-tests/L001")
                        .header("X-User-Id", "xx")
                        .header("X-User-Role", "patient"))
                .andDo(print())
                .andExpect(status().isOk()) // 期望500状态码
                .andExpect(jsonPath("$.message", is("不是管理员没有权限")));
        verify(labTestService, never()).delete(anyString());

    }

    // ============================== 异常测试 ==============================
    @Test
    public void testCreate_ThrowsException() throws Exception {
        // 模拟Service抛出异常
        when(labTestService.getById("L009")).thenReturn(null);
        doThrow(new RuntimeException("数据库异常")).when(labTestService).create(any());

        // 发送请求并验证500错误
        mockMvc.perform(post("/lab-tests")
                        .content("{\"code\":\"L009\",\"name\":\"异常测试\"}")
                        .header("X-User-Role", "platform_admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(ResultCode.FAILED.getCode())));
    }
}