package com.medical.user.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "通知邮件发送传输对象")
public class EmailRequestedDTO {

    private String to;

    private String subject;

    private String content;

    private Boolean isHtml;
}
