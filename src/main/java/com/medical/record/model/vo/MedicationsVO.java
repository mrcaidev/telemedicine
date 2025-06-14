package com.medical.record.model.vo;

import com.medical.record.model.entity.Medication;
import lombok.Data;

import java.util.List;

@Data
public class MedicationsVO {
    private List<Medication> medications;
    private String nextCursor;
}
