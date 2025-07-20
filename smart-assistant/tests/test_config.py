"""
测试专用配置模块
"""

import os
from dotenv import load_dotenv

def load_test_environment():
    """加载测试环境变量"""
    # 尝试加载测试专用的环境文件
    test_env_files = [
        '.env.test',      # 测试专用配置
        '.env.local',     # 本地开发配置
        '.env'            # 默认配置
    ]
    
    for env_file in test_env_files:
        env_path = os.path.join(os.path.dirname(__file__), '..', env_file)
        if os.path.exists(env_path):
            load_dotenv(env_path)
            print(f"✅ 测试环境已加载: {env_file}")
            return True
    
    print("⚠️  未找到环境配置文件，使用默认配置")
    return False

# 测试环境配置
TEST_CONFIG = {
    'REDIS_URL': os.getenv('REDIS_URL', 'redis://localhost:6379/1'),
    'MONGO_URL': os.getenv('MONGO_URL', 'mongodb://localhost:27017/test_db'),
    'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY', 'test_key'),
    'AGENT_ACCESS_KEY': os.getenv('AGENT_ACCESS_KEY', 'test_key'),
    'DEBUG': os.getenv('DEBUG', 'true').lower() == 'true',
    'ENVIRONMENT': os.getenv('ENVIRONMENT', 'test'),
}

def get_test_config():
    """获取测试配置"""
    return TEST_CONFIG.copy() 