package com.medical.record.feign;

import com.medical.record.common.Result;
import com.medical.record.model.vo.AppointmentVO;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * 预约服务Feign客户端
 */
@FeignClient(name = "medical-appointment",url = "http://localhost:3001/")
//@FeignClient(name = "medical-appointment",url = "https://m1.apifoxmock.com/m1/6162561-5854630-default/")
public interface AppointmentFeignClient {

    /**
     * 获取预约详情
     *
     * @param id     预约ID
     * @param userId 用户ID（从JWT中获取）
     *
     * @return 预约详情
     */
    @GetMapping("/appointments/{id}")
    Result<AppointmentVO> getAppointmentById(@Parameter(description = "预约ID") @PathVariable String id,
                                             @RequestHeader(value = "X-User-Id",required = false) String userId);


}
