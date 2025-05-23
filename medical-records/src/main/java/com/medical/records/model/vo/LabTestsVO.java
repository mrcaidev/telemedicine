package com.medical.records.model.vo;

import com.medical.records.model.entity.LabTest;
import lombok.Data;

import java.util.List;

@Data
public class LabTestsVO {
    private List<LabTest> labTests;
    private String nextCursor;
}
