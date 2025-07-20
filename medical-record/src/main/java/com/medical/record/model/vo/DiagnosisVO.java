package com.medical.record.model.vo;

import com.medical.record.model.entity.Diagnosis;
import lombok.Data;

import java.util.List;

@Data
public class DiagnosisVO {
    private List<Diagnosis> diagnosis;
    private String nextCursor;
}
