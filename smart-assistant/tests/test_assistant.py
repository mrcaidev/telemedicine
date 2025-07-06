import pytest
from unittest.mock import Mock, patch, AsyncMock
from uuid import uuid4
import app.assistant as Assistant


class TestAssistant:
    @pytest.mark.asyncio
    async def test_create_session(self):
        """测试创建会话"""
        user_id = uuid4()
        session_id = uuid4()
        
        with patch('app.assistant.session') as mock_session:
            mock_session.insert_session = AsyncMock()
            
            await Assistant.create_session(user_id, session_id)
            
            mock_session.insert_session.assert_called_once_with(user_id, session_id)

    @pytest.mark.asyncio
    async def test_get_session_success(self):
        """测试成功获取会话"""
        session_id = uuid4()
        user_id = uuid4()
        expected_result = {"session_id": str(session_id), "user_id": str(user_id)}
        
        with patch('app.assistant.session') as mock_session:
            mock_session.get_session = AsyncMock(return_value=expected_result)
            
            result = await Assistant.get_session(session_id, user_id)
            
            mock_session.get_session.assert_called_once_with(session_id, user_id)
            assert result == expected_result

    @pytest.mark.asyncio
    async def test_get_session_not_found(self):
        """测试获取不存在的会话"""
        session_id = uuid4()
        user_id = uuid4()
        
        with patch('app.assistant.session') as mock_session:
            mock_session.get_session = AsyncMock(return_value=None)
            
            result = await Assistant.get_session(session_id, user_id)
            
            mock_session.get_session.assert_called_once_with(session_id, user_id)
            assert result is None

    @pytest.mark.asyncio
    async def test_get_user_history(self):
        """测试获取用户历史记录"""
        user_id = uuid4()
        expected_history = [
            {"session_id": "1", "created_at": "2023-01-01"},
            {"session_id": "2", "created_at": "2023-01-02"}
        ]
        
        with patch('app.assistant.session') as mock_session:
            mock_session.get_user_history = AsyncMock(return_value=expected_history)
            
            result = await Assistant.get_user_history(user_id)
            
            mock_session.get_user_history.assert_called_once_with(user_id)
            assert result == expected_history

    @pytest.mark.asyncio
    async def test_delete_session_success(self):
        """测试成功删除会话"""
        session_id = uuid4()
        user_id = uuid4()
        expected_result = {"session_id": str(session_id), "user_id": str(user_id)}
        
        with patch('app.assistant.session') as mock_session:
            mock_session.delete_session = AsyncMock(return_value=expected_result)
            
            result = await Assistant.delete_session(session_id, user_id)
            
            mock_session.delete_session.assert_called_once_with(session_id, user_id)
            assert result == expected_result

    @pytest.mark.asyncio
    async def test_delete_session_not_found(self):
        """测试删除不存在的会话"""
        session_id = uuid4()
        user_id = uuid4()
        
        with patch('app.assistant.session') as mock_session:
            mock_session.delete_session = AsyncMock(return_value=None)
            
            result = await Assistant.delete_session(session_id, user_id)
            
            mock_session.delete_session.assert_called_once_with(session_id, user_id)
            assert result is None

    @pytest.mark.asyncio
    async def test_test_mongo_success(self):
        """测试MongoDB连接成功"""
        with patch('app.assistant.session') as mock_session:
            mock_session.test_connect = AsyncMock(return_value=True)
            
            result = await Assistant.test_mongo()
            
            mock_session.test_connect.assert_called_once()
            assert result is True

    @pytest.mark.asyncio
    async def test_test_mongo_failure(self):
        """测试MongoDB连接失败"""
        with patch('app.assistant.session') as mock_session:
            mock_session.test_connect = AsyncMock(return_value=False)
            
            result = await Assistant.test_mongo()
            
            mock_session.test_connect.assert_called_once()
            assert result is False 