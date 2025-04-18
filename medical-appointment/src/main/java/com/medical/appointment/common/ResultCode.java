package com.medical.appointment.common;

/**
 * 结果码枚举类
 */
public enum ResultCode implements IErrorCode {
    /**
     * 成功
     */
    SUCCESS(0, ""),

    /**
     * 失败
     */
    FAILED(50000, "操作失败"),

    /**
     * 参数校验失败
     */
    VALIDATE_FAILED(40000, "请求错误"),

    /**
     * 未认证
     */
    UNAUTHORIZED(40100, "未授权"),

    /**
     * 未授权
     */
    FORBIDDEN(40300, "禁止访问"),
    
    /**
     * 资源不存在
     */
    NOT_FOUND(40400, "资源不存在"),
    
    /**
     * 资源冲突
     */
    CONFLICT(40900, "资源冲突"),
    
    /**
     * 无法处理的内容
     */
    UNPROCESSABLE_CONTENT(42200, "无法处理的内容");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public Integer getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
} 