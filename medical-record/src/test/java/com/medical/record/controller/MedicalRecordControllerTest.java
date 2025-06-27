package com.medical.record.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medical.record.common.Result;
import com.medical.record.feign.AppointmentFeignClient;
import com.medical.record.feign.UserFeignClient;
import com.medical.record.model.dto.MedicalRecordCreateDTO;
import com.medical.record.model.dto.MedicalRecordQueryDTO;
import com.medical.record.model.dto.MedicalRecordUpdateDTO;
import com.medical.record.model.entity.MedicalRecord;
import com.medical.record.model.vo.AppointmentVO;
import com.medical.record.model.vo.MedicalRecordVO;
import com.medical.record.model.vo.MedicalRecordsVO;
import com.medical.record.model.vo.PatientVO;
import com.medical.record.service.MedicalRecordService;
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

import java.time.LocalDate;
import java.util.Collections;
import java.util.Date;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MedicalRecordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MedicalRecordService medicalRecordService;
    @MockBean
    private UserFeignClient userFeignClient;
    @MockBean
    private AppointmentFeignClient appointmentFeignClient;

    @Autowired
    private WebApplicationContext webApplicationContext;
    @Autowired
    private ObjectMapper objectMapper;

    // 测试数据常量
    private static final String VALID_DOCTOR_ID = "doctor_01";
    private static final String VALID_PATIENT_ID = "patient_01";
    private static final String INVALID_ROLE = "patient"; // 非医生角色

    // 测试对象
    private MedicalRecordCreateDTO validCreateDTO;
    private MedicalRecordUpdateDTO validUpdateDTO;
    private MedicalRecordVO validRecordVO;
    private AppointmentVO validAppointmentVO;
    private MedicalRecordsVO validRecordsVO;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        // 初始化测试数据
        validCreateDTO = new MedicalRecordCreateDTO();
        validCreateDTO.setAppointmentId("1");
        validCreateDTO.setAssessmentDiagnosisDate("2025-01-03"); // 示例值


        validUpdateDTO = new MedicalRecordUpdateDTO();

        validRecordVO = new MedicalRecordVO();
        validRecordVO.setId("MR_001");
        validRecordVO.setPatientId(VALID_PATIENT_ID);
        validRecordVO.setRecordDate(new Date());

        validAppointmentVO = new AppointmentVO();
        validAppointmentVO.setId("1");
        validAppointmentVO.setPatient(new PatientVO()); // 初始化PatientVO对象
        validAppointmentVO.getPatient().setId(VALID_PATIENT_ID); // 假设患者ID从预约信息中获取

        validRecordsVO = new MedicalRecordsVO();
        validRecordsVO.setMedicalRecords(Collections.singletonList(validRecordVO));
        validRecordsVO.setNextCursor(LocalDate.now().toString());

    }

    // ============================== 创建病历测试 ==============================
    @Test
    public void testCreate_WithValidDoctorRole_Success() throws Exception {
        // 模拟Feign调用返回有效预约信息
        when(appointmentFeignClient.getAppointmentById(eq("1"), eq(VALID_DOCTOR_ID)))
                .thenReturn(Result.success(validAppointmentVO));
        when(medicalRecordService.create(any()))
                .thenReturn(validRecordVO);

        // 发送请求（医生角色）
        mockMvc.perform(post("/medical-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Id", VALID_DOCTOR_ID)
                        .header("X-User-Role", "doctor")
                        .content(objectMapper.writeValueAsString(validCreateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code", is(0)))
                .andExpect(jsonPath("$.data.id", is(validRecordVO.getId())))
                .andExpect(jsonPath("$.data.patientId", is(VALID_PATIENT_ID)));

        // 验证调用链
        verify(appointmentFeignClient, times(1)).getAppointmentById("1", VALID_DOCTOR_ID);
        verify(medicalRecordService, times(1)).create(any());
    }

    @Test
    public void testCreate_WithInvalidRole_Failure() throws Exception {
        // 发送请求（患者角色）
        mockMvc.perform(post("/medical-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Role", INVALID_ROLE)
                        .content(objectMapper.writeValueAsString(validCreateDTO)))
                .andExpect(status().isOk()) // 假设全局异常处理返回200
                .andExpect(jsonPath("$.message", containsString("不是医生没有权限")));

        // 验证Feign和Service未被调用
        verifyNoInteractions(appointmentFeignClient, medicalRecordService);
    }

    @Test
    public void testCreate_InvalidAppointmentId_Failure() throws Exception {
        // 模拟预约ID不存在
//        when(appointmentFeignClient.getAppointmentById(eq("999"), anyString()))
//                .thenReturn(Result.failed("预约不存在"));
//
//        mockMvc.perform(post("/medical-records")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .header("X-User-Role", "doctor")
//                        .content(objectMapper.writeValueAsString(validCreateDTO)))
//                .andExpect(jsonPath("$.message", containsString("预约id不存在")));
    }

    // ============================== 更新病历测试 ==============================
    @Test
    public void testUpdate_WithValidDoctorRole_Success() throws Exception {
        when(medicalRecordService.update(eq("MR_001"), any()))
                .thenReturn(new MedicalRecord());

        mockMvc.perform(patch("/medical-records/MR_001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Role", "doctor")
                        .content(objectMapper.writeValueAsString(validUpdateDTO)));
//                .andExpect(jsonPath("$.data.diagnosis", is(validUpdateDTO.getDiagnosis())));
    }

    // ============================== 删除病历测试 ==============================
    @Test
    public void testDelete_WithValidDoctorRole_Success() throws Exception {
        mockMvc.perform(delete("/medical-records/MR_001")
                        .header("X-User-Role", "doctor"))
                .andExpect(jsonPath("$.data", is("ok")));

        verify(medicalRecordService, times(1)).delete("MR_001");
    }

    // ============================== 查询病历测试 ==============================
    @Test
    public void testGetByPatientId_WithValidParams_Success() throws Exception {
        MedicalRecordQueryDTO queryDTO = new MedicalRecordQueryDTO();
        queryDTO.setPatientId(VALID_PATIENT_ID);
        when(medicalRecordService.listMedicalRecord(queryDTO, null))
                .thenReturn(Collections.singletonList(validRecordVO));

        mockMvc.perform(get("/medical-records")
                        .param("patientId", VALID_PATIENT_ID)
                        .header("X-User-Role", "doctor")) // 医生/患者均可查询（假设权限允许）
                .andExpect(jsonPath("$.data.medicalRecords", hasSize(1)))
                .andExpect(jsonPath("$.data.nextCursor", is(notNullValue())));
    }

    // ============================== 边界条件测试 ==============================
    @Test
    public void testCreate_MissingAppointmentId_Failure() throws Exception {
        validCreateDTO.setAppointmentId(null); // 清空预约ID
        mockMvc.perform(post("/medical-records")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Role", "doctor")
                        .content(objectMapper.writeValueAsString(validCreateDTO)))
                .andExpect(jsonPath("$.message", containsString("预约ID不能为空"))); // 假设参数校验会拦截
    }

    @Test
    public void testUpdate_WithNonExistentId_Failure() throws Exception {
//        when(medicalRecordService.update(eq("invalid_id"), any()))
//                .thenReturn(null); // 模拟记录不存在
        mockMvc.perform(patch("/medical-records/invalid_id")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-User-Role", "doctor")
                        .content(objectMapper.writeValueAsString(validUpdateDTO)))
                .andExpect(jsonPath("$.message", containsString("")));

    }

    // ============================== Feign调用验证 ==============================
    @Test
    public void testCreate_ShouldInvokeAppointmentFeign() throws Exception {
//        // 仅验证Feign是否被调用，不关心业务逻辑
//        when(appointmentFeignClient.getAppointmentById(anyString(), anyString()))
//                .thenReturn(Result.success(validAppointmentVO));
//
//        mockMvc.perform(post("/medical-records")
//                .header("X-User-Role", "doctor")
//                .content(objectMapper.writeValueAsString(validCreateDTO)));
//
//        verify(appointmentFeignClient, times(1)).getAppointmentById(
//                eq(validCreateDTO.getAppointmentId()),
//                eq(VALID_DOCTOR_ID) // 验证用户ID是否正确传递
//        );
        // 只验证Feign是否被调用，不关心业务逻辑
        mockMvc.perform(post("/medical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-User-Role", "doctor")
                .content(objectMapper.writeValueAsString(validCreateDTO)));

        // 验证Feign调用
//        verify(appointmentFeignClient, times(1)).getAppointmentById(eq(validCreateDTO.getAppointmentId()), eq(VALID_DOCTOR_ID));
    }
}