package com.medical.user.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.medical.user.mapper.ClinicMapper;
import com.medical.user.model.entity.Clinic;
import com.medical.user.service.ClinicService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@Slf4j
public class ClinicServiceImpl extends ServiceImpl<ClinicMapper, Clinic> implements ClinicService {
}
