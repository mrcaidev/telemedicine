#!/usr/bin/env python3
"""
简单的测试运行脚本
"""

import subprocess
import sys
import os
from dotenv import load_dotenv

def load_test_env():
    """加载测试环境变量"""
    # 尝试加载测试专用的环境文件
    test_env_files = [
        '.env.test',      # 测试专用配置
        '.env.local',     # 本地开发配置
        '.env'            # 默认配置
    ]
    
    for env_file in test_env_files:
        if os.path.exists(env_file):
            load_dotenv(env_file)
            print(f"✅ 已加载环境文件: {env_file}")
            return True
    
    print("⚠️  未找到环境配置文件，使用默认配置")
    return False

def run_command(command):
    """运行命令并返回结果"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def main():
    """主函数"""
    print("🚀 智能助手项目测试运行器")
    print("=" * 50)
    
    # 加载测试环境变量
    load_test_env()
    
    # 检查是否安装了pytest
    success, output = run_command("python -c 'import pytest'")
    if not success:
        print("❌ 未安装pytest，正在安装...")
        success, output = run_command("pip install pytest pytest-asyncio httpx")
        if not success:
            print(f"❌ 安装失败: {output}")
            return 1
    
    # 运行简单测试验证
    print("🔍 运行简单测试验证...")
    success, output = run_command("python tests/test_simple.py")
    if not success:
        print(f"❌ 简单测试失败: {output}")
        return 1
    
    print("✅ 简单测试通过!")
    
    # 运行完整测试
    print("📋 运行完整测试套件...")
    success, output = run_command("python -m pytest tests/ -v")
    
    if success:
        print("✅ 所有测试通过!")
        print(output)
        return 0
    else:
        print("❌ 测试失败:")
        print(output)
        return 1

if __name__ == "__main__":
    sys.exit(main()) 