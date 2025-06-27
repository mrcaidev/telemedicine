package com.medical.record.service.impl;

import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.TableInfoHelper;
import com.medical.record.config.QWenConfig;
import com.medical.record.model.dto.MedicalRecordCreateDTO;
import com.medical.record.model.dto.MedicalRecordQueryDTO;
import com.medical.record.model.dto.MedicalRecordUpdateDTO;
import com.medical.record.model.entity.MedicalRecord;
import com.medical.record.model.vo.MedicalRecordVO;
import com.medical.record.repository.MedicalRecordRepository;
import org.apache.ibatis.builder.MapperBuilderAssistant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicalRecordServiceImplTest {

    @Mock
    private MedicalRecordRepository medicalRecordRepository;

    @Mock
    private QWenConfig qWenConfig;

    @InjectMocks
    private MedicalRecordServiceImpl medicalRecordService;

    private MedicalRecord record1;
    private MedicalRecord record2;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        record1 = new MedicalRecord();
        record1.setId("MR-001");
        record1.setPatientId("PAT-001");
        record1.setRecordDate(new Date());
        record1.setSubjectiveNotes("Fever and cough");
        record1.setPlanStartDate(new Date());
//        record1.setPlanStopDate(LocalDate.now().plusDays(7));
        record1.setPlanStopDate(new Date());


        record2 = new MedicalRecord();
        record2.setId("MR-002");
        record2.setPatientId("PAT-002");
//        record2.setRecordDate(LocalDate.now().minusDays(1));
        record2.setRecordDate(new Date());
        record2.setSubjectiveNotes("Headache and dizziness");
//        record2.setPlanStartDate(LocalDate.now().minusDays(1));
//        record2.setPlanStopDate(LocalDate.now().plusDays(6));
        record2.setPlanStartDate(new Date());
        record2.setPlanStopDate(new Date());

        // 关键修复：手动初始化实体类的 TableInfo
        TableInfoHelper.initTableInfo(
                new MapperBuilderAssistant(new MybatisConfiguration(), ""),
                MedicalRecord.class
        );
    }

    @Test
    @Transactional
    void create_ShouldSaveNewRecord() {
        // 准备DTO
        MedicalRecordCreateDTO dto = new MedicalRecordCreateDTO();
        dto.setPatientId("PAT-003");
        dto.setSubjectiveNotes("Sore throat");
//        dto.setPlanFollowupDate(LocalDate.now().plusDays(14));
        dto.setPlanFollowupDate(new Date());


        // 模拟保存行为
        when(medicalRecordRepository.insert(any(MedicalRecord.class))).thenAnswer(invocation -> {
            MedicalRecord savedRecord = invocation.getArgument(0);
            savedRecord.setId("MR-003"); // 模拟生成ID
            return 1;
        });

        // 执行测试
        MedicalRecordVO result = medicalRecordService.create(dto);

        // 验证结果
        assertNotNull(result);
        assertEquals("MR-003", result.getId());
        assertEquals("PAT-003", result.getPatientId());
        verify(medicalRecordRepository).insert(any(MedicalRecord.class));
    }

    @Test
    @Transactional
    void update_ShouldModifyExistingRecord() {
        // 准备更新DTO
        MedicalRecordUpdateDTO updateDTO = new MedicalRecordUpdateDTO();
        updateDTO.setAssessmentDiagnosisCode("DX-100");
//        updateDTO.setRecordDate(LocalDate.now().minusDays(2));
        updateDTO.setRecordDate(new Date());


        // 模拟查询行为
        when(medicalRecordRepository.selectById("MR-001")).thenReturn(record1);
        when(medicalRecordRepository.updateById(any(MedicalRecord.class))).thenReturn(1);

        // 执行测试
        MedicalRecord result = medicalRecordService.update("MR-001", updateDTO);

        // 验证结果
        assertEquals("DX-100", result.getAssessmentDiagnosisCode());
        //assertEquals(LocalDate.now().minusDays(2), result.getRecordDate());
        assertNotNull(result.getUpdatedAt());
        verify(medicalRecordRepository).updateById(any(MedicalRecord.class));
    }

    @Test
    @Transactional
    void update_WithInvalidId_ShouldThrowException() {
        // 模拟查询返回null
        when(medicalRecordRepository.selectById("INVALID_ID")).thenReturn(null);

        // 准备更新DTO
        MedicalRecordUpdateDTO updateDTO = new MedicalRecordUpdateDTO();

        // 执行测试并验证异常
        assertThrows(RuntimeException.class, () -> {
            medicalRecordService.update("INVALID_ID", updateDTO);
        });
    }

    @Test
    @Transactional
    void delete_ShouldRemoveRecord() {
        // 模拟删除行为
        when(medicalRecordRepository.deleteById("MR-001")).thenReturn(1);

        // 执行测试
        medicalRecordService.delete("MR-001");

        // 验证结果
        verify(medicalRecordRepository).deleteById("MR-001");
    }

    @Test
    void getById_ShouldReturnRecord() {
        // 模拟查询行为
        when(medicalRecordRepository.selectById("MR-001")).thenReturn(record1);

        // 执行测试
        MedicalRecord result = medicalRecordService.getById("MR-001");

        // 验证结果
        assertNotNull(result);
        assertEquals("MR-001", result.getId());
        assertEquals("PAT-001", result.getPatientId());
    }

    @Test
    void listMedicalRecord_WithPatientIdFilter_ShouldReturnFiltered() {
        // 准备参数
        MedicalRecordQueryDTO dto = new MedicalRecordQueryDTO();
        dto.setPatientId("PAT-001");
        dto.setSort_date("asc");
        dto.setLimit(10);

        // 模拟行为
        when(medicalRecordRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(record1));

        // 执行测试
        List<MedicalRecordVO> result = medicalRecordService.listMedicalRecord(dto, "token");

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("PAT-001", result.get(0).getPatientId());
    }

    @Test
    void listMedicalRecord_WithCursor_ShouldApplyCursorLogic() {
        // 准备参数
        MedicalRecordQueryDTO dto = new MedicalRecordQueryDTO();
        dto.setCursor("2023-01-01");
        dto.setSort_date("asc");
        dto.setLimit(1);

        // 模拟行为
        when(medicalRecordRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(record1));

        // 执行测试
        List<MedicalRecordVO> result = medicalRecordService.listMedicalRecord(dto, "token");

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("MR-001", result.get(0).getId());
    }

    @Test
    void listMedicalRecord_WithDescendingSort_ShouldApplyCorrectOrder() {
        // 准备参数
        MedicalRecordQueryDTO dto = new MedicalRecordQueryDTO();
        dto.setSort_date("desc");
        dto.setLimit(10);

        // 模拟行为（返回按日期降序排序的记录）
        List<MedicalRecord> records = new ArrayList<>();
        records.add(record1); // 较新的记录
        records.add(record2); // 较旧的记录
        when(medicalRecordRepository.selectList(any(LambdaQueryWrapper.class))).thenReturn(records);

        // 执行测试
        List<MedicalRecordVO> result = medicalRecordService.listMedicalRecord(dto, "token");

        // 验证结果
        assertEquals(2, result.size());
        // 第一项应该是较新的记录（record1）
        assertEquals("MR-001", result.get(0).getId());
    }

    @Test
    void getSummary_ShouldGenerateSummary() {
        // 模拟查询行为
        when(medicalRecordRepository.selectById("MR-001")).thenReturn(record1);

        // 模拟AI响应
        String expectedSummary = "Patient with fever and cough...";
        when(qWenConfig.sendChatRequest(anyString())).thenReturn(expectedSummary);

        // 执行测试
        String result = medicalRecordService.getSummary("MR-001");

        // 验证结果
        assertNotNull(result);
        assertEquals(expectedSummary, result);
        verify(qWenConfig).sendChatRequest(anyString());
    }

    @Test
    void buildMedicalRecordText_ShouldFormatCorrectly() {
        // 设置详细记录
        record1.setObjectiveTemperature(38.5f);
        record1.setObjectiveBloodPressure("120/80");
        record1.setAssessmentDiagnosisCode("DX-100");
        record1.setAssessmentDiagnosisDesc("Acute pharyngitis");
        record1.setPlanMedicationName("Amoxicillin");
        record1.setPlanMedicationCode("AMX-500");
        record1.setPlanDosageValue("500mg");
        record1.setPlanFrequencyCode("TID");
        record1.setPlanUsageCode("Oral");
        record1.setPlanLabTestName("Throat swab");
        record1.setPlanLabTestCode("TS-001");
        record1.setPlanFollowupType("Phone");

        // 执行测试
        String result = medicalRecordService.buildMedicalRecordText(record1);

        // 验证结果包含关键信息
        assertTrue(result.contains("patient ID: PAT-001"));
        assertTrue(result.contains("subjective symptoms:"));
        assertTrue(result.contains("Fever and cough"));
        assertTrue(result.contains("body temperature: 38.5"));
        assertTrue(result.contains("blood pressure: 120/80"));
        assertTrue(result.contains("diagnosis result:"));
        assertTrue(result.contains("Acute pharyngitis (DX-100)"));
        assertTrue(result.contains("drug: Amoxicillin (AMX-500)"));
        assertTrue(result.contains("dose: 500mg"));
        assertTrue(result.contains("frequency: TID"));
        assertTrue(result.contains("Medication method: Oral"));
        assertTrue(result.contains("Inspection items: Throat swab (TS-001)"));
        assertTrue(result.contains("Tracking plan:"));
        assertTrue(result.contains("type: Phone"));
        assertTrue(result.contains("summarize the above language"));
    }

    @Test
    void listMedicalRecord_WithEmptyResult_ShouldReturnEmptyList() {
        // 准备参数
        MedicalRecordQueryDTO dto = new MedicalRecordQueryDTO();
        dto.setPatientId("NON_EXISTENT_PATIENT");

        // 模拟空结果
        when(medicalRecordRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.emptyList());

        // 执行测试
        List<MedicalRecordVO> result = medicalRecordService.listMedicalRecord(dto, "token");

        // 验证结果
        assertTrue(result.isEmpty());
    }

    @Test
    void getSummary_WithInvalidId_ShouldThrowException() {
        // 模拟查询返回null
        when(medicalRecordRepository.selectById("INVALID_ID")).thenReturn(null);

        // 执行测试并验证异常
        assertThrows(RuntimeException.class, () -> {
            medicalRecordService.getSummary("INVALID_ID");
        });
    }
}