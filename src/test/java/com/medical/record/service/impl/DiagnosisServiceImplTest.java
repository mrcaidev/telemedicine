package com.medical.record.service.impl;

import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.TableInfoHelper;
import com.medical.record.model.dto.DiagnosisQueryDTO;
import com.medical.record.model.entity.Diagnosis;
import com.medical.record.repository.DiagnosisRepository;
import org.apache.ibatis.builder.MapperBuilderAssistant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DiagnosisServiceImplTest {

    @Mock
    private DiagnosisRepository diagnosisRepository;

    @InjectMocks
    private DiagnosisServiceImpl diagnosisService;

    private Diagnosis diagnosis1;
    private Diagnosis diagnosis2;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        diagnosis1 = new Diagnosis();
        diagnosis1.setCode("D001");
        diagnosis1.setDescription("Common cold");

        diagnosis2 = new Diagnosis();
        diagnosis2.setCode("D002");
        diagnosis2.setDescription("Influenza");

        // 关键修复：手动初始化实体类的 TableInfo
        TableInfoHelper.initTableInfo(
                new MapperBuilderAssistant(new MybatisConfiguration(), ""),
                Diagnosis.class
        );
    }

    @Test
    void getAll_ShouldReturnAllDiagnoses() {
        // 模拟行为
        when(diagnosisRepository.selectList(any())).thenReturn(Arrays.asList(diagnosis1, diagnosis2));

        // 执行测试
        List<Diagnosis> result = diagnosisService.getAll();

        // 验证结果
        assertEquals(2, result.size());
        assertTrue(result.contains(diagnosis1));
        assertTrue(result.contains(diagnosis2));

    }

    @Test
    void listDiagnosis_WithCodeFilter_ShouldReturnFiltered() {
        // 准备参数
        DiagnosisQueryDTO dto = new DiagnosisQueryDTO();
        dto.setCode("D001");
        dto.setSort_info("asc");
        dto.setLimit(10);

        // 模拟行为
        when(diagnosisRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(diagnosis1));

        // 执行测试
        List<Diagnosis> result = diagnosisService.listDiagnosis(dto);

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("D001", result.get(0).getCode());
    }

    @Test
    void listDiagnosis_WithCursor_ShouldApplyCursorLogic() {
        // 准备参数（测试游标分页）
        DiagnosisQueryDTO dto = new DiagnosisQueryDTO();
        dto.setCursor("D001");
        dto.setSort_info("asc");
        dto.setLimit(1);

        // 模拟行为
        when(diagnosisRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(diagnosis2));

        // 执行测试
        List<Diagnosis> result = diagnosisService.listDiagnosis(dto);

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("D002", result.get(0).getCode());
    }

    @Test
    void listDiagnosis_WithDescriptionFilter_ShouldReturnFiltered() {
        // 准备参数
        DiagnosisQueryDTO dto = new DiagnosisQueryDTO();
        dto.setDescription("Influenza");
        dto.setSort_info("desc");
        dto.setLimit(5);

        // 模拟行为
        when(diagnosisRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(diagnosis2));

        // 执行测试
        List<Diagnosis> result = diagnosisService.listDiagnosis(dto);

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("Influenza", result.get(0).getDescription());
    }

    @Test
    void listDiagnosis_WithDescendingSort_ShouldApplyCorrectOrder() {
        // 准备参数
        DiagnosisQueryDTO dto = new DiagnosisQueryDTO();
        dto.setSort_info("desc");
        dto.setLimit(10);

        // 模拟行为
        when(diagnosisRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Arrays.asList(diagnosis2, diagnosis1));

        // 执行测试
        List<Diagnosis> result = diagnosisService.listDiagnosis(dto);

        // 验证结果
        assertEquals(2, result.size());
        assertEquals("D002", result.get(0).getCode()); // 第一项应该是D002（降序）
    }

    @Test
    @Transactional
    void create_ShouldSaveNewDiagnosis() {
        // 模拟保存行为
        when(diagnosisRepository.insert(diagnosis1)).thenReturn(1);

        // 执行测试
        Diagnosis result = diagnosisService.create(diagnosis1);

        // 验证结果
        assertNotNull(result);
        verify(diagnosisRepository).insert(diagnosis1);
    }

    @Test
    @Transactional
    void update_ShouldModifyExistingDiagnosis() {
        // 模拟查询行为
        when(diagnosisRepository.selectById("D001")).thenReturn(diagnosis1);
        when(diagnosisRepository.updateById(any(Diagnosis.class))).thenReturn(1);

        // 准备更新数据
        Diagnosis updateData = new Diagnosis();
        updateData.setDescription("Severe common cold");

        // 执行测试
        Diagnosis result = diagnosisService.update("D001", updateData);

        // 验证结果
        assertEquals("Severe common cold", result.getDescription());
        verify(diagnosisRepository).updateById(diagnosis1);
    }

    @Test
    @Transactional
    void update_WithNonExistingCode_ShouldThrowException() {
        // 模拟查询返回null
        when(diagnosisRepository.selectById("INVALID_CODE")).thenReturn(null);

        // 准备更新数据
        Diagnosis updateData = new Diagnosis();
        updateData.setDescription("Test description");

        // 执行测试并验证异常
        assertThrows(RuntimeException.class, () -> {
            diagnosisService.update("INVALID_CODE", updateData);
        });
    }

    @Test
    @Transactional
    void delete_ShouldRemoveDiagnosis() {
        // 模拟删除行为
        when(diagnosisRepository.deleteById("D001")).thenReturn(1);

        // 执行测试
        diagnosisService.delete("D001");

        // 验证结果
        verify(diagnosisRepository).deleteById("D001");
    }

    @Test
    void listDiagnosis_WithEmptyResult_ShouldReturnEmptyList() {
        // 准备参数
        DiagnosisQueryDTO dto = new DiagnosisQueryDTO();
        dto.setCode("NON_EXISTING_CODE");

        // 模拟行为
        when(diagnosisRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.emptyList());

        // 执行测试
        List<Diagnosis> result = diagnosisService.listDiagnosis(dto);

        // 验证结果
        assertTrue(result.isEmpty());
    }
}