package com.medical.record.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.record.config.QWenConfig;
import com.medical.record.model.dto.MedicalRecordCreateDTO;
import com.medical.record.model.dto.MedicalRecordCreatedEvent;
import com.medical.record.model.dto.MedicalRecordQueryDTO;
import com.medical.record.model.dto.MedicalRecordUpdateDTO;
import com.medical.record.model.entity.MedicalRecord;
import com.medical.record.model.vo.MedicalRecordVO;
import com.medical.record.repository.MedicalRecordRepository;

import com.medical.record.service.MedicalRecordService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class MedicalRecordServiceImpl extends ServiceImpl<MedicalRecordRepository, MedicalRecord> implements MedicalRecordService {

    @Resource
    private QWenConfig qWenConfig;
    @Resource
    private KafkaTemplate<String, Object> kafkaTemplate;
    private static final String MEDICAL_RECORD_CREATED_TOPIC = "MedicalRecordCreated";

    @Override
    @Transactional(rollbackFor = Exception.class)
    public MedicalRecordVO create(MedicalRecordCreateDTO recordDto) {
        MedicalRecord record = BeanUtil.copyProperties(recordDto,MedicalRecord.class);
//        record.setPlanFollowupDate(strTODate(recordDto.getPlanFollowupDate()));
        record.setPlanFollowupDate(recordDto.getPlanFollowupDate());
        record.setCreatedAt(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());
        save(record);
        MedicalRecordVO vo = BeanUtil.copyProperties(record,MedicalRecordVO.class);
        //发送Kafka消息通知预约服务
        sendMedicalRecordCreatedEvent(record);
        return vo;
    }

    /**
     * 发送病历创建事件到Kafka（核心逻辑）
     */
    public void sendMedicalRecordCreatedEvent(MedicalRecord medicalRecord) {
        // 获取预约ID
        String appointmentId = medicalRecord.getAppointmentId();

        // 校验关键参数
        if (medicalRecord.getId() == null || appointmentId == null) {
            throw new IllegalArgumentException("病历ID和预约ID不能为空");
        }

        // 构建Kafka消息（仅包含必要字段）
        MedicalRecordCreatedEvent event = new MedicalRecordCreatedEvent(
                medicalRecord.getId(),
                appointmentId,
                LocalDateTime.now()
        );

        // 发送消息到Kafka
        kafkaTemplate.send(MEDICAL_RECORD_CREATED_TOPIC, event);

        // 记录消息发送日志
        log.info("成功发送病历创建事件到Kafka，topic: {}, 病历ID: {}, 预约ID: {}",
                MEDICAL_RECORD_CREATED_TOPIC,
                medicalRecord.getId(),
                appointmentId);
    }

    public static Date strTODate(String str){
        LocalDate localDate = LocalDate.parse(str);
        Date date = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        return date;
    }
    public static LocalDateTime strTOLocalDateTime(String str){
        return OffsetDateTime.parse(str, DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public MedicalRecord update(String id, MedicalRecordUpdateDTO updatedFields) {
        MedicalRecord record = getById(id);
        if(null == record){
            throw new RuntimeException("id不对");
        }
        // 更新允许修改的字段
        if (updatedFields.getAssessmentDiagnosisCode() != null) record.setAppointmentId(updatedFields.getAssessmentDiagnosisCode());
        if (updatedFields.getRecordDate() != null) record.setRecordDate(updatedFields.getRecordDate());
        BeanUtil.copyProperties(updatedFields,record);
        record.setId(id);

        record.setUpdatedAt(LocalDateTime.now());
        updateById(record);
        return record;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        removeById(id);
    }

    @Override
    public MedicalRecord getById(String id) {
        return super.getById(id);
    }

    @Override
    public List<MedicalRecordVO> listMedicalRecord(MedicalRecordQueryDTO dto, String token) {
        LambdaQueryWrapper<MedicalRecord> queryWrapper = new LambdaQueryWrapper<>();

        // 根据患者ID过滤
        if (dto.getPatientId() != null && !dto.getPatientId().isEmpty()) {
            queryWrapper.eq(MedicalRecord::getPatientId, dto.getPatientId());
        }

        // 处理游标
        if (dto.getCursor() != null && !dto.getCursor().isEmpty()) {
            if ("asc".equalsIgnoreCase(dto.getSort_date())) {
                queryWrapper.gt(MedicalRecord::getPlanStartDate, dto.getCursor());
            } else {
                queryWrapper.lt(MedicalRecord::getPlanStartDate, dto.getCursor());
            }
        }

        // 设置排序
        if ("asc".equalsIgnoreCase(dto.getSort_date())) {
            queryWrapper.orderByAsc(MedicalRecord::getPlanStopDate, MedicalRecord::getPlanStopDate);
        } else {
            queryWrapper.orderByDesc(MedicalRecord::getPlanStopDate, MedicalRecord::getPlanStopDate);
        }

        // 限制查询条数
        queryWrapper.last("LIMIT " + dto.getLimit());

        // 查询预约列表
        List<MedicalRecord> medicalRecords = list(queryWrapper);

        // 转换为视图对象
        List<MedicalRecordVO> voList = new ArrayList<>();
        for (MedicalRecord medicalRecord : medicalRecords) {
            MedicalRecordVO vo = BeanUtil.copyProperties(medicalRecord,MedicalRecordVO.class);
            voList.add(vo);
        }

        return voList;
    }

    @Override
    public String getSummary(String id) {
        MedicalRecord record = getById(id);
                //.orElseThrow(() -> new IllegalArgumentException("Medical record not found"));

        // 构建用于生成摘要的完整医疗记录文本
        String recordText = buildMedicalRecordText(record);

        // 调用Gemini API生成摘要
//        return geminiService.generateSummary(recordText);
        return qWenConfig.sendChatRequest(recordText);
    }

    public String buildMedicalRecordText(MedicalRecord record) {
        StringBuilder sb = new StringBuilder();
        //患者ID
        sb.append("patient ID: ").append(record.getPatientId()).append("\n");
        //记录日期
        sb.append("record date: ").append(record.getRecordDate()).append("\n\n");
        //主观症状
        sb.append("subjective symptoms:\n").append(record.getSubjectiveNotes()).append("\n\n");
        //客观检查
        sb.append("objective examination:\n");
        if (record.getObjectiveTemperature() != null) {
            //体温
            sb.append("body temperature: ").append(record.getObjectiveTemperature()).append("°C\n");
        }
        if (record.getObjectiveBloodPressure() != null) {
            //血压
            sb.append("blood pressure: ").append(record.getObjectiveBloodPressure()).append("\n");
        }
        // 添加其他客观检查指标...

        //诊断结果
        sb.append("\ndiagnosis result:\n");
        if (record.getAssessmentDiagnosisDesc() != null) {
            sb.append(record.getAssessmentDiagnosisDesc()).append(" (").append(record.getAssessmentDiagnosisCode()).append(")\n");
        }
        //治疗计划
        sb.append("\ntreatment plan:\n");
        if (record.getPlanMedicationName() != null) {
            //药物
            sb.append("drug: ").append(record.getPlanMedicationName()).append(" (").append(record.getPlanMedicationCode()).append(")\n");
            //剂量
            sb.append("dose: ").append(record.getPlanDosageValue()).append("\n");
            //频率
            sb.append("frequency: ").append(record.getPlanFrequencyCode()).append("\n");
            //用药方式
            sb.append("Medication method: ").append(record.getPlanUsageCode()).append("\n");
            //疗程 至
            sb.append("Course of treatment: ").append(record.getPlanStartDate()).append(" until ").append(record.getPlanStopDate()).append("\n");
        }

        if (record.getPlanLabTestName() != null) {
            //检验项目
            sb.append("Inspection items: ").append(record.getPlanLabTestName()).append(" (").append(record.getPlanLabTestCode()).append(")\n");
        }

        if (record.getPlanFollowupType() != null) {
            //跟踪计划
            sb.append("\nTracking plan:\n");
            //类型
            sb.append("type: ").append(record.getPlanFollowupType()).append("\n");
            //日期
            sb.append("date: ").append(record.getPlanFollowupDate()).append("\n");
        }
        sb.append(",summarize the above language");
        return sb.toString();
    }
}
