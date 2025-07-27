import asyncio
import logging
import json
from uuid import UUID
import re
from typing import Dict, Any, Optional
import app.config as config

import app.session as session
from app.difyUtils import DifyAPI
from app.model import ChatbotOutput
from pydantic import ValidationError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 硬编码Dify API密钥
DIFY_API_KEY = config.DIFY_API_KEY

# 创建Dify API实例
dify_client = DifyAPI(api_key=DIFY_API_KEY)




def parse_dify_response(response_text: str) -> Dict[str, Any]:
    """
    解析Dify API的响应，尝试提取JSON结构
    
    Args:
        response_text: Dify API返回的文本响应
        
    Returns:
        解析后的响应字典
    """
    try:
        # 尝试直接解析JSON
        if response_text.strip().startswith('{') and response_text.strip().endswith('}'):
            return json.loads(response_text)
        
        # 尝试从文本中提取JSON
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            return json.loads(json_str)
        
        # 如果没有找到JSON，作为普通消息处理
        return {
            "type": "message",
            "message": response_text
        }
        
    except (json.JSONDecodeError, ValidationError) as e:
        logger.warning(f"Failed to parse JSON response: {e}")
        # 解析失败时，作为普通消息处理
        return {
            "type": "message",
            "message": response_text
        }


async def speak_to_bot(id: UUID, user_message: str) -> Dict[str, Any]:
    """
    与聊天机器人对话的主函数
    
    Args:
        id: 会话ID
        user_message: 用户消息
        
    Returns:
        机器人响应
    """
    try:
        # 验证用户消息
        if not user_message or not user_message.strip():
            logger.error("User message is empty")
            return {
                "role": "assistant",
                "content": "请输入您的症状或问题。",
                "type": "message"
            }
        
        # 获取会话历史
        history = await session.get_session_history(id)
        if history is None:
            history = []
        
        # 添加用户消息到历史
        user = {"role": "user", "content": user_message}
        history.append(user)
        
        # 构建历史字符串
        history_str = "\n".join(
            f"{m['role'].capitalize()}: {m['content']}" for m in history
        )

        
        # 调用Dify API（提示词已在Dify平台配置）
        dify_response = await dify_client.send_message(
            query=history_str.strip()
        )
        
        # 获取Dify的响应文本
        response_text = dify_response.get('answer', '')
        
        # 解析响应
        result = parse_dify_response(response_text)
        
        if result.get('type') == 'message':
            # 继续对话：保存assistant的这次问句到历史
            assistant_message = result.get('message', '')
            history.append({"role": "assistant", "content": assistant_message})
            await session.update_session_history(id, history)
            
            return {
                "role": "assistant",
                "content": assistant_message,
                "type": "message"
            }
        
        elif result.get('type') == 'evaluation':
            # 评估结果：保存评估信息
            # 转换urgency为数字
            urgency_int = result.get('Urgency')
            
            # 转换keywords为字符串
            keywords_list = result.get('Keywords', [])
            keywords_str = ', '.join(keywords_list) if isinstance(keywords_list, list) else str(keywords_list)
            
            await save_evaluation_results(
                id,
                result.get('Symptom', ''),
                urgency_int,
                result.get('Suggestion', ''),
                keywords_str
            )
            
            return {
                "role": "assistant",
                "symptom": result.get('Symptom', ''),
                "urgency": result.get('Urgency'),
                "suggestion": result.get('Suggestion', ''),
                "keyword": result.get('Keywords', []),
                "type": "evaluation"
            }
        
        else:
            # 默认作为消息处理
            history.append({"role": "assistant", "content": response_text})
            await session.update_session_history(id, history)
            
            return {
                "role": "assistant",
                "content": response_text,
                "type": "message"
            }
            
    except Exception as e:
        logger.error(f"Error in speak_to_bot: {e}")
        # 返回错误响应
        return {
            "role": "assistant",
            "content": "抱歉，我遇到了一些技术问题。请稍后再试。",
            "type": "message",
            "error": str(e)
        }


async def save_evaluation_results(id: UUID, symptom: str, urgency: int, suggestion: str, keyword: str):
    """
    保存评估结果到会话
    
    Args:
        id: 会话ID
        symptom: 症状描述
        urgency: 紧急程度 (1=low, 2=medium, 3=high)
        suggestion: 建议
        keyword: 关键词字符串
    """
    try:
        await session.update_session_evaluation(
            id=id,
            symptom=symptom,
            urgency=urgency,
            suggestion=suggestion,
            keyword=keyword
        )
        logger.info(f"Evaluation results saved for session {id}")
    except Exception as e:
        logger.error(f"Failed to save evaluation results for session {id}: {e}")


async def main():
    """测试函数"""
    print("🧪 测试Dify Chatbot")
    print("=" * 50)
    
    # 模拟会话ID
    test_session_id = UUID('12345678-1234-1234-1234-123456789abc')
    
    # 测试对话
    test_messages = [
        "你好，我最近感觉不太舒服",
        "我头痛，而且有点发烧",
        "体温大概38度，头痛已经持续两天了"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n📝 测试 {i}: {message}")
        print("-" * 30)
        
        try:
            response = await speak_to_bot(test_session_id, message)
            print(f"🤖 响应类型: {response.get('type')}")
            
            if response.get('type') == 'message':
                print(f"💬 消息: {response.get('content')}")
            elif response.get('type') == 'evaluation':
                print(f"🏥 症状: {response.get('symptom')}")
                print(f"⚠️  紧急程度: {response.get('urgency')}")
                print(f"💡 建议: {response.get('suggestion')}")
                print(f"🔑 关键词: {response.get('keyword')}")
            
        except Exception as e:
            print(f"❌ 错误: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 测试完成！")


if __name__ == "__main__":
    # 运行测试
    asyncio.run(main()) 