package com.medical.records.model.vo;

import com.medical.records.model.entity.Diagnosis;
import lombok.Data;

import java.util.List;

@Data
public class DiagnosissVO {
    private List<Diagnosis> diagnosiss;
    private String nextCursor;
}
