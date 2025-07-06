import pytest
from unittest.mock import Mock, patch, AsyncMock
import json
from uuid import uuid4
from app.app import session_validate


class TestUtils:
    @pytest.mark.asyncio
    async def test_session_validate_success(self):
        """测试会话验证成功"""
        session_id = str(uuid4())
        user_id = str(uuid4())
        
        with patch('app.app.RedisUtils.get_key') as mock_get_key:
            mock_get_key.return_value = {
                "key": user_id,
                "value": json.dumps({
                    "userId": user_id,
                    "sessionId": session_id
                })
            }
            
            result = await session_validate(session_id, user_id)
            assert result is True

    @pytest.mark.asyncio
    async def test_session_validate_wrong_session(self):
        """测试会话验证 - 错误的会话ID"""
        session_id = str(uuid4())
        user_id = str(uuid4())
        wrong_session_id = str(uuid4())
        
        with patch('app.app.RedisUtils.get_key') as mock_get_key:
            mock_get_key.return_value = {
                "key": user_id,
                "value": json.dumps({
                    "userId": user_id,
                    "sessionId": session_id
                })
            }
            
            result = await session_validate(wrong_session_id, user_id)
            assert result is False

    @pytest.mark.asyncio
    async def test_session_validate_exception(self):
        """测试会话验证 - 发生异常"""
        session_id = str(uuid4())
        user_id = str(uuid4())
        
        with patch('app.app.RedisUtils.get_key') as mock_get_key:
            mock_get_key.side_effect = Exception("Redis error")
            
            result = await session_validate(session_id, user_id)
            assert result is False

    @pytest.mark.asyncio
    async def test_session_validate_key_not_found(self):
        """测试会话验证 - 键不存在"""
        session_id = str(uuid4())
        user_id = str(uuid4())
        
        from fastapi import HTTPException
        with patch('app.app.RedisUtils.get_key') as mock_get_key:
            mock_get_key.side_effect = HTTPException(status_code=404, detail="Key not found")
            
            result = await session_validate(session_id, user_id)
            assert result is False 