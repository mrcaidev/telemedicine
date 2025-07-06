package com.medical.record.model.dto;

/**
 * ClassName:MedicalRecordCreatedEvent
 * Package:com.medical.record.model.dto
 * Description:
 *
 * @Author runge
 * @Create 2025/7/5 17:10
 * @Version 1.0
 */
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
public class MedicalRecordCreatedEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    // 病历ID（必须）
    private String recordId;
    // 对应的预约ID（必须）
    private String appointmentId;
    // 消息创建时间（可选，用于时间追踪）
    private LocalDateTime createTime;
}
