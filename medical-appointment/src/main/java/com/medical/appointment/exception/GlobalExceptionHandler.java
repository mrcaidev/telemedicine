package com.medical.appointment.exception;

import com.medical.appointment.common.Result;
import com.medical.appointment.common.ResultCode;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理MethodArgumentNotValidException异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("参数校验失败", e);
        BindingResult bindingResult = e.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        String message = fieldErrors.stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return Result.validateFailed(message);
    }

    /**
     * 处理ConstraintViolationException异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e) {
        log.error("参数校验失败", e);
        Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
        String message = violations.stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining("; "));
        return Result.validateFailed(message);
    }

    /**
     * 处理BindException异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(BindException.class)
    public Result<Void> handleBindException(BindException e) {
        log.error("参数绑定失败", e);
        BindingResult bindingResult = e.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        String message = fieldErrors.stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return Result.validateFailed(message);
    }

    /**
     * 处理MissingServletRequestParameterException异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public Result<Void> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        log.error("缺少请求参数", e);
        return Result.validateFailed("缺少请求参数: " + e.getParameterName());
    }

    /**
     * 处理HttpMessageNotReadableException异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Result<Void> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.error("请求体无法解析", e);
        return Result.validateFailed("请求体无法解析，请检查JSON格式是否正确");
    }

    /**
     * 处理MethodArgumentTypeMismatchException异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public Result<Void> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        log.error("参数类型不匹配", e);
        return Result.validateFailed("参数类型不匹配: " + e.getName());
    }

    /**
     * 处理HttpRequestMethodNotSupportedException异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Result<Void> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.error("不支持的HTTP方法", e);
        return Result.failed(ResultCode.VALIDATE_FAILED, "不支持的HTTP方法: " + e.getMethod());
    }

    /**
     * 处理RuntimeException异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(RuntimeException.class)
    public Result<Void> handleRuntimeException(RuntimeException e) {
        log.error("运行时异常", e);
        if (e.getMessage().contains("not found") || e.getMessage().contains("不存在")) {
            return Result.failed(ResultCode.NOT_FOUND, e.getMessage());
        } else if (e.getMessage().contains("forbidden") || e.getMessage().contains("禁止")) {
            return Result.failed(ResultCode.FORBIDDEN, e.getMessage());
        } else if (e.getMessage().contains("unauthorized") || e.getMessage().contains("未授权")) {
            return Result.failed(ResultCode.UNAUTHORIZED, e.getMessage());
        } else if (e.getMessage().contains("conflict") || e.getMessage().contains("冲突")) {
            return Result.failed(ResultCode.CONFLICT, e.getMessage());
        } else {
            return Result.failed(e.getMessage());
        }
    }

    /**
     * 处理Exception异常
     *
     * @param e 异常
     * @return 结果
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("服务器内部错误", e);
        return Result.failed(ResultCode.FAILED, "服务器内部错误");
    }
}