import json
from uuid import UUID

from redis.asyncio import Redis
from fastapi import HTTPException
import app.config as config

# 配置 Redis 连接
REDIS_URL = f"redis://{config.REDIS_HOST}:{config.REDIS_PORT}"

EXPIRE_SECONDS = 60 * 60

redis = Redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)

# 向redis中插入一个数据
async def set_key(key:str, value:str):
    try:
        await redis.setex(key, EXPIRE_SECONDS, value)
        return {"message": "set data successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 向redis中获取一个数据
async def get_key(key: str):
    value = await redis.get(key)  # 获取键对应的值
    if value is None:
        raise HTTPException(status_code=404, detail="Key not found")
    await redis.expire(key, EXPIRE_SECONDS) # 重置过期时间
    return {"key": key, "value": value}


async def update_key(key: str, value: str):
    exists = await redis.exists(key)
    if not exists:
        raise HTTPException(status_code=404, detail="Key not found")

    await redis.setex(key, EXPIRE_SECONDS, value)  # 更新键值对
    return {"message": "Key updated successfully"}


async def delete_key(key: str):
    result = await redis.delete(key)  # 删除指定键
    if result == 0:
        return {"message": "Key not found"}
    return {"message": "Key deleted successfully"}

async def test_ping():
    result = await redis.ping()
    if result:
        return True
    else:
        return False
