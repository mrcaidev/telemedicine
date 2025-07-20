import pytest
from unittest.mock import Mock
from fastapi import HTTPException
from app.httpMiddleware import validate_request_header
from app.respCode import RespCode
from app.model import ResponseData


class TestHttpMiddleware:
    @pytest.mark.asyncio
    async def test_validate_request_header_success(self):
        """测试有效的请求头"""
        # 创建模拟请求
        mock_request = Mock()
        mock_request.headers = {
            "X-User-Id": "123e4567-e89b-12d3-a456-426614174000",
            "X-User-Role": "patient"
        }
        
        # 调用异步函数
        result = await validate_request_header(mock_request)
        
        # 验证结果
        assert result is None

    @pytest.mark.asyncio
    async def test_validate_request_header_missing_user_id(self):
        """测试缺少用户ID"""
        # 创建模拟请求
        mock_request = Mock()
        mock_request.headers = {
            "X-User-Role": "patient"
        }
        
        # 调用异步函数
        result = await validate_request_header(mock_request)
        
        # 验证结果
        assert isinstance(result, ResponseData)
        assert result.code == RespCode.NOT_LOGIN_IN
        assert result.message == "User Not Login in"
        assert result.data is None

    @pytest.mark.asyncio
    async def test_validate_request_header_empty_user_id(self):
        """测试空的用户ID"""
        # 创建模拟请求
        mock_request = Mock()
        mock_request.headers = {
            "X-User-Id": "",
            "X-User-Role": "patient"
        }
        
        # 调用异步函数
        result = await validate_request_header(mock_request)
        
        # 验证结果
        assert isinstance(result, ResponseData)
        assert result.code == RespCode.NOT_LOGIN_IN
        assert result.message == "User Not Login in"
        assert result.data is None

    @pytest.mark.asyncio
    async def test_validate_request_header_missing_role(self):
        """测试缺少用户角色"""
        # 创建模拟请求
        mock_request = Mock()
        mock_request.headers = {
            "X-User-Id": "123e4567-e89b-12d3-a456-426614174000"
        }
        
        # 调用异步函数
        result = await validate_request_header(mock_request)
        
        # 验证结果
        assert isinstance(result, ResponseData)
        assert result.code == RespCode.UNAUTHORIZED
        assert result.message == "Unauthorized"
        assert result.data is None

    @pytest.mark.asyncio
    async def test_validate_request_header_empty_role(self):
        """测试空的用户角色"""
        # 创建模拟请求
        mock_request = Mock()
        mock_request.headers = {
            "X-User-Id": "123e4567-e89b-12d3-a456-426614174000",
            "X-User-Role": ""
        }
        
        # 调用异步函数
        result = await validate_request_header(mock_request)
        
        # 验证结果
        assert isinstance(result, ResponseData)
        assert result.code == RespCode.UNAUTHORIZED
        assert result.message == "Unauthorized"
        assert result.data is None

    @pytest.mark.asyncio
    async def test_validate_request_header_wrong_role(self):
        """测试错误的用户角色"""
        # 创建模拟请求
        mock_request = Mock()
        mock_request.headers = {
            "X-User-Id": "123e4567-e89b-12d3-a456-426614174000",
            "X-User-Role": "doctor"
        }
        
        # 调用异步函数
        result = await validate_request_header(mock_request)
        
        # 验证结果
        assert isinstance(result, ResponseData)
        assert result.code == RespCode.UNAUTHORIZED
        assert result.message == "Unauthorized"
        assert result.data is None

    @pytest.mark.asyncio
    async def test_validate_request_header_no_headers(self):
        """测试没有请求头"""
        # 创建模拟请求
        mock_request = Mock()
        mock_request.headers = {}
        
        # 调用异步函数
        result = await validate_request_header(mock_request)
        
        # 验证结果
        assert isinstance(result, ResponseData)
        assert result.code == RespCode.NOT_LOGIN_IN
        assert result.message == "User Not Login in"
        assert result.data is None 