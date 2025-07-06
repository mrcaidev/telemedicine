package com.medical.record.service.impl;

import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.TableInfoHelper;
import com.medical.record.model.dto.MedicationQueryDTO;
import com.medical.record.model.entity.Medication;
import com.medical.record.repository.MedicationRepository;
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
class MedicationServiceImplTest {

    @Mock
    private MedicationRepository medicationRepository;

    @InjectMocks
    private MedicationServiceImpl medicationService;

    private Medication medication1;
    private Medication medication2;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        medication1 = new Medication();
        medication1.setCode("MED-001");
        medication1.setName("Aspirin");

        medication2 = new Medication();
        medication2.setCode("MED-002");
        medication2.setName("Ibuprofen");

        // 关键修复：手动初始化实体类的 TableInfo
        TableInfoHelper.initTableInfo(
                new MapperBuilderAssistant(new MybatisConfiguration(), ""),
                Medication.class
        );
    }

    @Test
    void getAll_ShouldReturnAllMedications() {
        // 模拟行为
        when(medicationRepository.selectList(any())).thenReturn(Arrays.asList(medication1, medication2));

        // 执行测试
        List<Medication> result = medicationService.getAll();

        // 验证结果
        assertEquals(2, result.size());
        assertTrue(result.contains(medication1));
        assertTrue(result.contains(medication2));
    }

    @Test
    void listMedication_WithCodeFilter_ShouldReturnFiltered() {
        // 准备参数
        MedicationQueryDTO dto = new MedicationQueryDTO();
        dto.setCode("MED-001");
        dto.setSort_info("asc");
        dto.setLimit(10);

        // 模拟行为
        when(medicationRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(medication1));

        // 执行测试
        List<Medication> result = medicationService.listMedication(dto);

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("MED-001", result.get(0).getCode());
    }

    @Test
    void listMedication_WithNameFilter_ShouldReturnFiltered() {
        // 准备参数
        MedicationQueryDTO dto = new MedicationQueryDTO();
        dto.setName("Ibuprofen");
        dto.setSort_info("desc");
        dto.setLimit(5);

        // 模拟行为
        when(medicationRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(medication2));

        // 执行测试
        List<Medication> result = medicationService.listMedication(dto);

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("Ibuprofen", result.get(0).getName());
    }

    @Test
    void listMedication_WithCursor_ShouldApplyCursorLogic() {
        // 准备参数
        MedicationQueryDTO dto = new MedicationQueryDTO();
        dto.setCursor("MED-001");
        dto.setSort_info("asc");
        dto.setLimit(1);

        // 模拟行为
        when(medicationRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(medication2)); // 返回MED-002

        // 执行测试
        List<Medication> result = medicationService.listMedication(dto);

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("MED-002", result.get(0).getCode());
    }

    @Test
    void listMedication_WithDescendingSort_ShouldApplyCorrectOrder() {
        // 准备参数
        MedicationQueryDTO dto = new MedicationQueryDTO();
        dto.setSort_info("desc");
        dto.setLimit(10);

        // 模拟行为（返回按编码降序排序的记录）
        when(medicationRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Arrays.asList(medication2, medication1)); // MED-002 在前

        // 执行测试
        List<Medication> result = medicationService.listMedication(dto);

        // 验证结果
        assertEquals(2, result.size());
        assertEquals("MED-002", result.get(0).getCode()); // 第一项应该是MED-002（降序）
    }

    @Test
    @Transactional
    void create_ShouldSaveNewMedication() {
        // 模拟保存行为 - 返回整数（受影响行数）
        when(medicationRepository.insert(any(Medication.class))).thenReturn(1);

        // 执行测试
        Medication result = medicationService.create(medication1);

        // 验证结果
        assertNotNull(result);
        verify(medicationRepository).insert(medication1);
    }

    @Test
    @Transactional
    void update_ShouldModifyExistingMedication() {
        // 模拟查询行为
        when(medicationRepository.selectById("MED-001")).thenReturn(medication1);

        // 模拟更新行为 - 返回整数（受影响行数）
        when(medicationRepository.updateById(any(Medication.class))).thenReturn(1);

        // 准备更新数据
        Medication updateData = new Medication();
        updateData.setName("Aspirin Plus");

        // 执行测试
        Medication result = medicationService.update("MED-001", updateData);

        // 验证结果
        assertEquals("Aspirin Plus", result.getName());
        verify(medicationRepository).updateById(medication1);
    }

    @Test
    @Transactional
    void update_WithNonExistingCode_ShouldThrowException() {
        // 模拟查询返回null
        when(medicationRepository.selectById("INVALID_CODE")).thenReturn(null);

        // 准备更新数据
        Medication updateData = new Medication();
        updateData.setName("Test Medication");

        // 执行测试并验证异常
        assertThrows(IllegalArgumentException.class, () -> {
            medicationService.update("INVALID_CODE", updateData);
        });
    }

    @Test
    @Transactional
    void delete_ShouldRemoveMedication() {
        // 模拟删除行为 - 返回整数（受影响行数）
        when(medicationRepository.deleteById("MED-001")).thenReturn(1);

        // 执行测试
        medicationService.delete("MED-001");

        // 验证结果
        verify(medicationRepository).deleteById("MED-001");
    }

    @Test
    void listMedication_WithEmptyResult_ShouldReturnEmptyList() {
        // 准备参数
        MedicationQueryDTO dto = new MedicationQueryDTO();
        dto.setCode("NON_EXISTING_CODE");

        // 模拟行为
        when(medicationRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.emptyList());

        // 执行测试
        List<Medication> result = medicationService.listMedication(dto);

        // 验证结果
        assertTrue(result.isEmpty());
    }

    @Test
    void listMedication_WithDefaultSort_ShouldApplyAscendingOrder() {
        // 准备参数（不指定排序方向）
        MedicationQueryDTO dto = new MedicationQueryDTO();
        dto.setSort_info(null);
        dto.setLimit(10);

        // 模拟行为（返回按编码升序排序的记录）
        when(medicationRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Arrays.asList(medication1, medication2)); // MED-001 在前

        // 执行测试
        List<Medication> result = medicationService.listMedication(dto);

        // 验证结果
        assertEquals(2, result.size());
        assertEquals("MED-001", result.get(0).getCode()); // 第一项应该是MED-001（默认升序）
    }
}