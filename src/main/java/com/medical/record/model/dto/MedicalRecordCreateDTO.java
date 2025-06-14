package com.medical.record.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Date;

@Data
public class MedicalRecordCreateDTO {
    /**
     * 预约ID
     */
    @NotBlank(message = "预约ID不能为空")
    private String appointmentId;

    /**
     * 评估诊断代码
     */
    private String assessmentDiagnosisCode;

    /**
     * 评估诊断日期
     */
    @NotBlank(message = "评估诊断日期不能为空")
    private String assessmentDiagnosisDate;

    /**
     * 评估诊断描述
     */
    private String assessmentDiagnosisDesc;

    /**
     * 客观血压
     */
    private String objectiveBloodPressure;

    /**
     * 客观心率
     */
    private Integer objectiveHeartRate;

    /**
     * 客观身高
     */
    private Float objectiveHeight;

    /**
     * 客观其他生命体征
     */
    private String objectiveOtherVitals;

    /**
     * 客观体温
     */
    private Float objectiveTemperature;

    /**
     * 客观体重
     */
    private Float objectiveWeight;

    /**
     * 患者ID
     */
    private String patientId;

    /**
     * 计划用药剂量
     */
    private String planDosageValue;

    /**
     * 计划随访日期
     */
    private Date planFollowupDate;

    /**
     * 计划随访类型
     */
    private String planFollowupType;

    /**
     * 计划用药频率代码
     */
    private String planFrequencyCode;

    /**
     * 计划实验室检查代码
     */
    private String planLabTestCode;

    /**
     * 计划实验室检查名称
     */
    private String planLabTestName;

    /**
     * 计划用药代码
     */
    private String planMedicationCode;

    /**
     * 计划用药名称
     */
    private String planMedicationName;

    /**
     * 计划开始日期
     */
    private Date planStartDate;

    /**
     * 计划结束日期
     */
    private Date planStopDate;

    /**
     * 计划用药使用代码
     */
    private String planUsageCode;

    /**
     * 记录日期
     */
    private Date recordDate;

    /**
     * 主观笔记
     */
    private String subjectiveNotes;

}
