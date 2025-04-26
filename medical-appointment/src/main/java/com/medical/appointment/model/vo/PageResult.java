package com.medical.appointment.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 分页结果
 * @param <T> 数据类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {
    /**
     * 数据列表
     */
    private List<T> list;

    /**
     * 下一页游标
     */
    private String nextCursor;

    /**
     * 创建分页结果
     *
     * @param list 数据列表
     * @param nextCursor 下一页游标
     * @param <T> 数据类型
     * @return 分页结果
     */
    public static <T> PageResult<T> of(List<T> list, String nextCursor) {
        return new PageResult<>(list, nextCursor);
    }
} 