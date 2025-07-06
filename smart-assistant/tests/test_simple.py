#!/usr/bin/env python3
"""
简单的测试验证脚本
"""

import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 加载测试环境配置
from tests.test_config import load_test_environment
load_test_environment()

def test_imports():
    """测试基本导入"""
    try:
        import app
        print("✅ 成功导入 app 模块")
    except ImportError as e:
        print(f"❌ 导入 app 模块失败: {e}")
        return False
    
    try:
        from app import config
        print("✅ 成功导入 config 模块")
    except ImportError as e:
        print(f"❌ 导入 config 模块失败: {e}")
        return False
    
    try:
        from app import model
        print("✅ 成功导入 model 模块")
    except ImportError as e:
        print(f"❌ 导入 model 模块失败: {e}")
        return False
    
    return True

def test_config():
    """测试配置加载"""
    try:
        from app import config
        from tests.test_config import get_test_config
        
        test_config = get_test_config()
        
        # 检查必要的配置项
        required_configs = ['REDIS_URL', 'MONGO_URL', 'OPENAI_API_KEY']
        missing_configs = []
        
        for config_name in required_configs:
            config_value = getattr(config, config_name, None)
            if not config_value:
                # 使用测试配置的默认值
                config_value = test_config.get(config_name)
                if not config_value:
                    missing_configs.append(config_name)
        
        if missing_configs:
            print(f"⚠️  缺少配置项: {missing_configs}")
        else:
            print("✅ 配置加载正常")
        
        return len(missing_configs) == 0
        
    except Exception as e:
        print(f"❌ 配置测试失败: {e}")
        return False

def test_models():
    """测试数据模型"""
    try:
        from app.model import SessionRequest, ChatRequest, ChatResponse
        
        # 测试 SessionRequest
        session_req = SessionRequest(access_key="test_key")
        assert session_req.access_key == "test_key"
        print("✅ SessionRequest 模型正常")
        
        # 测试 ChatRequest
        chat_req = ChatRequest(message="Hello", session_id="test_session")
        assert chat_req.message == "Hello"
        assert chat_req.session_id == "test_session"
        print("✅ ChatRequest 模型正常")
        
        # 测试 ChatResponse
        chat_resp = ChatResponse(message="Hi there", session_id="test_session")
        assert chat_resp.message == "Hi there"
        assert chat_resp.session_id == "test_session"
        print("✅ ChatResponse 模型正常")
        
        return True
        
    except Exception as e:
        print(f"❌ 模型测试失败: {e}")
        return False

def main():
    """主测试函数"""
    print("🧪 简单测试验证")
    print("=" * 30)
    
    tests = [
        ("导入测试", test_imports),
        ("配置测试", test_config),
        ("模型测试", test_models),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}...")
        if test_func():
            passed += 1
        else:
            print(f"❌ {test_name} 失败")
    
    print(f"\n📊 测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过!")
        return 0
    else:
        print("💥 部分测试失败!")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 