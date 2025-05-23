package com.medical.records.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medical.records.config.GeminiConfig;
import com.medical.records.model.dto.GeminiRequest;
import com.medical.records.model.dto.GeminiResponse;
import com.medical.records.service.GeminiService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Slf4j
@Service
public class GeminiServiceImpl implements GeminiService {
    @Resource
    private GeminiConfig config;
    @Resource
    private RestTemplate restTemplate;
    @Resource
    private ObjectMapper objectMapper;

    @Override
    public String generateSummary(String medicalRecord) {
        try {
            // 构建请求
            GeminiRequest request = buildGeminiRequest(medicalRecord);

            // 设置HTTP头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + config.getApiKey());

            // 构建HTTP请求
            HttpEntity<GeminiRequest> entity = new HttpEntity<>(request, headers);

            // 发送请求
            ResponseEntity<GeminiResponse> response = restTemplate.exchange(
                    config.getEndpoint(),
                    HttpMethod.POST,
                    entity,
                    GeminiResponse.class
            );

            // 处理响应
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return extractSummaryFromResponse(response.getBody());
            } else {
                throw new RuntimeException("Failed to get summary from Gemini API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while calling Gemini API", e);
        }
    }

    private GeminiRequest buildGeminiRequest(String medicalRecord) {
        // 构建提示词
        String prompt = "请为以下医疗记录生成一份简洁的摘要：\n\n" + medicalRecord +
                "\n\n摘要应包括：主要症状、诊断结果、治疗方案和建议的随访计划。";

        // 构建请求对象
        return GeminiRequest.builder()
                .contents(Collections.singletonList(
                        GeminiRequest.Content.builder()
                                .parts(Collections.singletonList(
                                        GeminiRequest.Part.builder()
                                                .text(prompt)
                                                .build()
                                ))
                                .build()
                ))
                .generationConfig(GeminiRequest.GenerationConfig.builder()
                        .temperature(0.7)
                        .topK(40)
                        .topP(0.95)
                        .maxOutputTokens(1024)
                        .build())
                .build();
    }

    private String extractSummaryFromResponse(GeminiResponse response) {
        if (response.getCandidates() != null && !response.getCandidates().isEmpty() &&
                response.getCandidates().get(0).getContent() != null &&
                response.getCandidates().get(0).getContent().getParts() != null &&
                !response.getCandidates().get(0).getContent().getParts().isEmpty()) {

            return response.getCandidates().get(0).getContent().getParts().get(0).getText();
        }
        return "无法生成摘要";
    }
}
