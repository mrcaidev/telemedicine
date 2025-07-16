import pytest
from unittest.mock import Mock, patch, AsyncMock
from fastapi import HTTPException
import app.redisUtils as RedisUtils


class TestRedisUtils:
    @pytest.mark.asyncio
    async def test_set_key_success(self):
        """测试成功设置键值对"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.setex = AsyncMock(return_value=True)
            
            result = await RedisUtils.set_key("test_key", "test_value")
            
            mock_redis.setex.assert_called_once_with("test_key", 3600, "test_value")
            assert result == {"message": "set data successfully"}

    @pytest.mark.asyncio
    async def test_set_key_exception(self):
        """测试设置键值对时发生异常"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.setex = AsyncMock(side_effect=Exception("Redis error"))
            
            with pytest.raises(HTTPException) as exc_info:
                await RedisUtils.set_key("test_key", "test_value")
            
            assert exc_info.value.status_code == 500
            assert "Redis error" in str(exc_info.value.detail)

    @pytest.mark.asyncio
    async def test_get_key_success(self):
        """测试成功获取键值对"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.get = AsyncMock(return_value="test_value")
            mock_redis.expire = AsyncMock(return_value=True)
            
            result = await RedisUtils.get_key("test_key")
            
            mock_redis.get.assert_called_once_with("test_key")
            mock_redis.expire.assert_called_once_with("test_key", 3600)
            assert result == {"key": "test_key", "value": "test_value"}

    @pytest.mark.asyncio
    async def test_get_key_not_found(self):
        """测试获取不存在的键"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.get = AsyncMock(return_value=None)
            
            with pytest.raises(HTTPException) as exc_info:
                await RedisUtils.get_key("test_key")
            
            assert exc_info.value.status_code == 404
            assert exc_info.value.detail == "Key not found"

    @pytest.mark.asyncio
    async def test_update_key_success(self):
        """测试成功更新键值对"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.exists = AsyncMock(return_value=True)
            mock_redis.setex = AsyncMock(return_value=True)
            
            result = await RedisUtils.update_key("test_key", "new_value")
            
            mock_redis.exists.assert_called_once_with("test_key")
            mock_redis.setex.assert_called_once_with("test_key", 3600, "new_value")
            assert result == {"message": "Key updated successfully"}

    @pytest.mark.asyncio
    async def test_update_key_not_found(self):
        """测试更新不存在的键"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.exists = AsyncMock(return_value=False)
            
            with pytest.raises(HTTPException) as exc_info:
                await RedisUtils.update_key("test_key", "new_value")
            
            assert exc_info.value.status_code == 404
            assert exc_info.value.detail == "Key not found"

    @pytest.mark.asyncio
    async def test_delete_key_success(self):
        """测试成功删除键"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.delete = AsyncMock(return_value=1)
            
            result = await RedisUtils.delete_key("test_key")
            
            mock_redis.delete.assert_called_once_with("test_key")
            assert result == {"message": "Key deleted successfully"}

    @pytest.mark.asyncio
    async def test_delete_key_not_found(self):
        """测试删除不存在的键"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.delete = AsyncMock(return_value=0)
            
            result = await RedisUtils.delete_key("test_key")
            
            mock_redis.delete.assert_called_once_with("test_key")
            assert result == {"message": "Key not found"}

    @pytest.mark.asyncio
    async def test_test_ping_success(self):
        """测试Redis连接成功"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.ping = AsyncMock(return_value=True)
            
            result = await RedisUtils.test_ping()
            
            mock_redis.ping.assert_called_once()
            assert result is True

    @pytest.mark.asyncio
    async def test_test_ping_failure(self):
        """测试Redis连接失败"""
        with patch('app.redisUtils.redis') as mock_redis:
            mock_redis.ping = AsyncMock(return_value=False)
            
            result = await RedisUtils.test_ping()
            
            mock_redis.ping.assert_called_once()
            assert result is False 