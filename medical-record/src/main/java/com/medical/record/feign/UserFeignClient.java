package com.medical.record.feign;

import com.medical.record.common.Result;
import com.medical.record.model.vo.DoctorVO;
import com.medical.record.model.vo.PatientVO;
import com.medical.record.model.vo.UserVO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * 用户服务Feign客户端
 * https://m1.apifoxmock.com/m1/6162561-5854630-default/auth/me
 */
@FeignClient(name = "medical-user",url = "http://localhost:3000/")
//@FeignClient(name = "medical-user",url = "https://m1.apifoxmock.com/m1/6162561-5854630-default/")
public interface UserFeignClient {

    /**
     * 通过ID获取用户详情
     *
     * @param id 用户ID
     *
     * @return 用户详情
     */
    @GetMapping("/users/{id}")
    Result<PatientVO> getUserById(@PathVariable String id, @RequestHeader("Authorization") String token);

    /**
     * 通过ID获取医生详情
     *
     * @param id 医生ID
     *
     * @return 医生详情
     */
    @GetMapping("/doctors/{id}")
    Result<DoctorVO> getDoctorById(@PathVariable String id, @RequestHeader("Authorization") String token);

    /**
     *
     * @return
     */
    @GetMapping("/auth/me")
    Result<UserVO> getCurrentUser(@RequestHeader(value = "X-User-Id",required = false) String userId);
}
