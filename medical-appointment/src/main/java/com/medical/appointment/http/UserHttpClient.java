package com.medical.appointment.http;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medical.appointment.common.Result;
import com.medical.appointment.model.vo.DoctorVO;
import com.medical.appointment.model.vo.PatientVO;
import org.springframework.stereotype.Service;

/**
 * 用户信息获取
 */
@Service
public class UserHttpClient {

    private String host = "http://127.0.0.1:8080/api";

    /**
     * 通过ID获取用户详情
     *
     * @param id 用户ID
     * @param token 令牌
     * @return 用户详情
     */
    public Result<PatientVO> getUserById(String id, String token) {
        HttpResponse response = HttpRequest.get(host + "/users/" + id)
                .header("Authorization", token)
                .execute();
        if (response.isOk()) {
            // 打印响应内容
            // 获取响应内容
            String responseBody = response.body();

            // 将响应内容转换为 Result<PatientVO>
            ObjectMapper objectMapper = new ObjectMapper();
            Result<PatientVO> result = null;
            try {
                result = objectMapper.readValue(responseBody, new TypeReference<Result<PatientVO>>() {});
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            return result;
        } else {
            // TODO 请求失败
            return null;
        }
    }

    /**
     * 通过ID获取医生详情
     *
     * @param id 医生ID
     * @param token 令牌
     * @return 医生详情
     */
    public Result<DoctorVO> getDoctorById(String id, String token) {
        HttpResponse response = HttpRequest.get(host + "/doctors/" + id)
                .header("Authorization", token)
                .execute();
        if (response.isOk()) {
            // 打印响应内容
            // 获取响应内容
            String responseBody = response.body();

            // 将响应内容转换为 Result<PatientVO>
            ObjectMapper objectMapper = new ObjectMapper();
            Result<DoctorVO> result = null;
            try {
                result = objectMapper.readValue(responseBody, new TypeReference<Result<DoctorVO>>() {});
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            return result;
        } else {
            // TODO 请求失败
            return null;
        }
    }
}
