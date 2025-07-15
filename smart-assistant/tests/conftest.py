import pytest
import sys
import os
from dotenv import load_dotenv

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 为测试加载本地环境配置
def pytest_configure(config):
    """pytest配置 - 加载测试环境变量"""
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
            print(f"✅ 已加载环境文件: {env_file}")
            break
    else:
        print("⚠️  未找到环境配置文件，使用默认配置")

# 测试配置
pytest_plugins = []

def pytest_unconfigure(config):
    """pytest清理"""
    pass 