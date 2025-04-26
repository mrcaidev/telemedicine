package com.medical.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.medical.user.model.entity.OtpCode;
import org.apache.ibatis.annotations.Mapper;

/**
 * 验证码Mapper接口
 */
@Mapper
public interface OtpCodeMapper extends BaseMapper<OtpCode> {
} 