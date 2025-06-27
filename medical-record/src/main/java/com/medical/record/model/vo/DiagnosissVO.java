package com.medical.record.model.vo;

import com.medical.record.model.entity.Diagnosis;
import lombok.Data;

import java.util.List;

@Data
public class DiagnosissVO {
    private List<Diagnosis> diagnosiss;
    private String nextCursor;
}
