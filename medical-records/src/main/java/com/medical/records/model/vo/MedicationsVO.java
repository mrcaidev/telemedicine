package com.medical.records.model.vo;

import com.medical.records.model.entity.Medication;
import lombok.Data;

import java.util.List;

@Data
public class MedicationsVO {
    private List<Medication> medications;
    private String nextCursor;
}
