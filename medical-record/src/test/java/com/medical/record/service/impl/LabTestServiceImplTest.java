package com.medical.record.service.impl;

import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.TableInfoHelper;
import com.medical.record.model.dto.LabTestQueryDTO;
import com.medical.record.model.entity.LabTest;
import com.medical.record.repository.LabTestRepository;
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
class LabTestServiceImplTest {

    @Mock
    private LabTestRepository labTestRepository;

    @InjectMocks
    private LabTestServiceImpl labTestService;

    private LabTest test1;
    private LabTest test2;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        test1 = new LabTest();
        test1.setCode("A001");
        test1.setName("Blood Test");

        test2 = new LabTest();
        test2.setCode("A002");
        test2.setName("Urine Test");

        // 关键修复：手动初始化实体类的 TableInfo
        TableInfoHelper.initTableInfo(new MapperBuilderAssistant(new MybatisConfiguration(), ""), LabTest.class);
    }

    @Test
    void getAll_ShouldReturnAllTests() {
        // 模拟行为
        when(labTestRepository.selectList(any())).thenReturn(Arrays.asList(test1, test2));

        // 执行测试
        List<LabTest> result = labTestService.getAll();

        // 验证结果
        assertEquals(2, result.size());
        assertTrue(result.contains(test1));
        assertTrue(result.contains(test2));
    }

    @Test
    void listLabTest_WithCodeFilter_ShouldReturnFiltered() {
        // 准备参数
        LabTestQueryDTO dto = new LabTestQueryDTO();
        dto.setCode("A001");
        dto.setSort_info("asc");
        dto.setLimit(10);

        // 模拟行为
        when(labTestRepository.selectList(any(LambdaQueryWrapper.class)))
                .thenReturn(Collections.singletonList(test1));

        // 执行测试
        List<LabTest> result = labTestService.listLabTest(dto);

        // 验证结果
        assertEquals(1, result.size());
        assertEquals("A001", result.get(0).getCode());
    }

    @Test
    @Transactional
    void create_ShouldSaveNewTest() {
        // 模拟保存行为
        when(labTestRepository.insert(any(LabTest.class))).thenReturn(1);

        // 执行测试
        LabTest result = labTestService.create(test1);

        // 验证结果
        assertNotNull(result);
        verify(labTestRepository).insert(test1);
    }

    @Test
    @Transactional
    void update_ShouldModifyExistingTest() {
        // 模拟查询行为
        when(labTestRepository.selectById("A001")).thenReturn(test1);
        when(labTestRepository.updateById(any(LabTest.class))).thenReturn(1);

        // 准备更新数据
        LabTest updateData = new LabTest();
        updateData.setName("Updated Blood Test");

        // 执行测试
        LabTest result = labTestService.update("A001", updateData);

        // 验证结果
        assertEquals("Updated Blood Test", result.getName());
        verify(labTestRepository).updateById(test1);
    }

    @Test
    @Transactional
    void delete_ShouldRemoveTest() {
        // 模拟删除行为
        when(labTestRepository.deleteById("A001")).thenReturn(1);

        // 执行测试
        labTestService.delete("A001");

        // 验证结果
        verify(labTestRepository).deleteById("A001");
    }
}