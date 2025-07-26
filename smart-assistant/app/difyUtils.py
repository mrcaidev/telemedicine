import json
import aiohttp
import asyncio
from typing import Dict, Any, Optional
from fastapi import HTTPException


class DifyAPI:
    """Dify API 工具类"""
    
    def __init__(self, api_key: str):
        """
        初始化Dify API客户端
        
        Args:
            api_key: Dify API密钥
        """
        self.base_url = "https://api.dify.ai/v1"
        self.api_key = api_key
        if not self.api_key:
            raise ValueError("Dify API key is required")
    
    async def send_message(
        self,
        query: str,
        inputs: Optional[Dict[str, Any]] = None,
        response_mode: str = "blocking",
        conversation_id: str = "",
        user: str = "default-user"
    ) -> Dict[str, Any]:
        """
        发送消息到Dify API
        
        Args:
            query: 用户查询内容
            inputs: 输入参数
            response_mode: 响应模式，默认为"blocking"
            conversation_id: 对话ID，用于连续对话
            user: 用户标识
            
        Returns:
            API响应数据
        """
        # 验证query参数
        if not query or not query.strip():
            raise ValueError("Query parameter is required and cannot be empty")
        
        payload = {
            "inputs": inputs or {},
            "query": query.strip(),
            "response_mode": response_mode,
            "conversation_id": conversation_id,
            "user": user
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        print(f"🔍 Debug: Sending payload to Dify API:")
        print(f"   Query: {query[:50]}...")
        print(f"   User: {user}")
        print(f"   Conversation ID: {conversation_id}")
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/chat-messages",
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result
                    else:
                        error_text = await response.text()
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Dify API error: {error_text}"
                        )
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Network error when calling Dify API: {str(e)}"
            )
        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=408,
                detail="Request timeout when calling Dify API"
            )
    
    async def get_conversation_history(self, conversation_id: str) -> Dict[str, Any]:
        """
        获取对话历史
        
        Args:
            conversation_id: 对话ID
            
        Returns:
            对话历史数据
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.base_url}/conversations/{conversation_id}/messages",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result
                    else:
                        error_text = await response.text()
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Dify API error: {error_text}"
                        )
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Network error when calling Dify API: {str(e)}"
            )
    
    async def delete_conversation(self, conversation_id: str) -> Dict[str, Any]:
        """
        删除对话
        
        Args:
            conversation_id: 对话ID
            
        Returns:
            删除结果
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.delete(
                    f"{self.base_url}/conversations/{conversation_id}",
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result
                    else:
                        error_text = await response.text()
                        raise HTTPException(
                            status_code=response.status,
                            detail=f"Dify API error: {error_text}"
                        )
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Network error when calling Dify API: {str(e)}"
            )


# 便捷函数
async def send_dify_message(
    query: str,
    inputs: Optional[Dict[str, Any]] = None,
    conversation_id: str = "",
    user: str = "default-user",
    api_key: str = ""
) -> Dict[str, Any]:
    """
    便捷函数：发送消息到Dify
    
    Args:
        query: 用户查询内容
        inputs: 输入参数
        conversation_id: 对话ID
        user: 用户标识
        api_key: API密钥
        
    Returns:
        API响应数据
    """
    dify_api = DifyAPI(api_key=api_key)
    return await dify_api.send_message(
        query=query,
        inputs=inputs,
        conversation_id=conversation_id,
        user=user
    )


async def get_dify_conversation_history(
    conversation_id: str,
    api_key: str
) -> Dict[str, Any]:
    """
    便捷函数：获取对话历史
    
    Args:
        conversation_id: 对话ID
        api_key: API密钥
        
    Returns:
        对话历史数据
    """
    dify_api = DifyAPI(api_key=api_key)
    return await dify_api.get_conversation_history(conversation_id)


async def delete_dify_conversation(
    conversation_id: str,
    api_key: str
) -> Dict[str, Any]:
    """
    便捷函数：删除对话
    
    Args:
        conversation_id: 对话ID
        api_key: API密钥
        
    Returns:
        删除结果
    """
    dify_api = DifyAPI(api_key=api_key)
    return await dify_api.delete_conversation(conversation_id)


async def main():
    """主函数 - 用于测试Dify API"""
    print("🧪 测试Dify API工具类")
    print("=" * 50)

    API_KEY = "xxxxxxx"
    
    try:
        # 创建API实例
        dify_api = DifyAPI(api_key=API_KEY)
        print(f"✅ API实例创建成功")
        
        # 测试1: 发送简单消息
        print("\n📝 测试1: 发送简单消息")
        response1 = await dify_api.send_message(
            query="What are the specs of the iPhone 13 Pro Max?",
            user="test-user-1"
        )
        
        print(f"✅ 消息发送成功")
        print(f"📝 响应ID: {response1.get('id', 'N/A')}")
        print(f"💬 回答: {response1.get('answer', 'N/A')[:100]}...")
        print(f"🆔 对话ID: {response1.get('conversation_id', 'N/A')}")
        
        # 获取使用统计
        usage = response1.get('metadata', {}).get('usage', {})
        if usage:
            print(f"📊 Token使用: {usage.get('total_tokens', 'N/A')}")
            print(f"💰 费用: {usage.get('total_price', 'N/A')} {usage.get('currency', 'USD')}")
        
        conversation_id = response1.get('conversation_id', '')
        
        # 测试2: 连续对话
        if conversation_id:
            print(f"\n🔄 测试2: 连续对话 (conversation_id: {conversation_id})")
            response2 = await dify_api.send_message(
                query="请详细介绍一下iPhone 13 Pro Max的相机功能",
                conversation_id=conversation_id,
                user="test-user-1"
            )
            
            print(f"✅ 连续对话成功")
            print(f"💬 回答: {response2.get('answer', 'N/A')[:100]}...")
        
        # 测试3: 带输入参数的消息
        print(f"\n📋 测试3: 带输入参数的消息")
        inputs = {
            "context": "用户正在询问关于智能手机的信息",
            "language": "zh-CN"
        }
        
        response3 = await dify_api.send_message(
            query="请介绍一下最新的智能手机技术",
            inputs=inputs,
            user="test-user-2"
        )
        
        print(f"✅ 带参数消息发送成功")
        print(f"💬 回答: {response3.get('answer', 'N/A')[:100]}...")
        
        # 测试4: 使用便捷函数
        print(f"\n⚡ 测试4: 使用便捷函数")
        response4 = await send_dify_message(
            query="Hello, this is a test using convenience function",
            user="test-user-3"
        )
        
        print(f"✅ 便捷函数测试成功")
        print(f"💬 回答: {response4.get('answer', 'N/A')[:100]}...")
        
        # 测试5: 获取对话历史（如果有conversation_id）
        if conversation_id:
            print(f"\n📚 测试5: 获取对话历史")
            try:
                history = await dify_api.get_conversation_history(conversation_id)
                print(f"✅ 对话历史获取成功")
                print(f"📊 历史消息数: {len(history.get('data', []))}")
            except Exception as e:
                print(f"⚠️  获取对话历史失败: {e}")
        
        print("\n" + "=" * 50)
        print("🎉 所有测试完成！Dify API工具类工作正常。")
        
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        print("\n可能的原因:")
        print("1. API密钥无效")
        print("2. 网络连接问题")
        print("3. Dify服务暂时不可用")


if __name__ == "__main__":
    # 运行测试
    asyncio.run(main()) 