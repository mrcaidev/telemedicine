package com.medical.record.model.vo;

import com.medical.record.model.entity.LabTest;
import lombok.Data;

import java.util.List;

@Data
public class LabTestsVO {
    private List<LabTest> labTests;
    private String nextCursor;
}
