package com.medical.user.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 统一响应结果
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {

    /**
     * 状态码
     */
    private Integer code;

    /**
     * 消息
     */
    private String message = "操作成功!";

    /**
     * 数据
     */
    private T data;

    /**
     * 成功
     */
    public static <T> Result<T> success() {
        return new Result<>(0, "操作成功!", null);
    }

    /**
     * 成功
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(0, "操作成功", data);
    }

    /**
     * 失败
     */
    public static <T> Result<T> fail(Integer code, String message) {
        return new Result<>(code, message, null);
    }

    /**
     * 未授权
     */
    public static <T> Result<T> unauthorized() {
        return fail(40100, "Unauthorized");
    }

    /**
     * 未找到
     */
    public static <T> Result<T> notFound() {
        return fail(40400, "Not found");
    }

    /**
     * 请求错误
     */
    public static <T> Result<T> badRequest() {
        return fail(40000, "Bad request");
    }

    /**
     * 冲突
     */
    public static <T> Result<T> conflict() {
        return fail(40900, "Conflict");
    }

    /**
     * 无法处理
     */
    public static <T> Result<T> unprocessable() {
        return fail(42200, "Unprocessable content");
    }

    /**
     * 请求过多
     */
    public static <T> Result<T> tooManyRequests() {
        return fail(42900, "Too many requests");
    }

    /**
     * 服务器错误
     */
    public static <T> Result<T> error() {
        return fail(50000, "Internal server error");
    }
}
