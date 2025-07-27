#!/usr/bin/env python3
"""
Docker测试运行脚本
"""

import subprocess
import sys
import os
import platform

def run_command(command, shell=True):
    """运行命令并返回结果"""
    try:
        result = subprocess.run(command, shell=shell, check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def check_docker():
    """检查Docker是否可用"""
    success, _ = run_command("docker --version")
    if not success:
        print("❌ Docker 未安装或不在PATH中")
        return False
    
    success, _ = run_command("docker info")
    if not success:
        print("❌ Docker 未运行，请先启动Docker Desktop")
        return False
    
    return True

def check_docker_compose():
    """检查docker-compose是否可用"""
    success, _ = run_command("docker-compose --version")
    if not success:
        print("❌ docker-compose 未安装或不在PATH中")
        return False
    return True

def main():
    """主函数"""
    print("🚀 Docker单元测试运行器")
    print("=" * 50)
    
    # 检查Docker环境
    if not check_docker():
        return 1
    
    if not check_docker_compose():
        return 1
    
    # 停止并清理之前的测试容器
    print("🧹 清理之前的测试容器...")
    run_command("docker-compose -f docker-compose.test.yml down -v")
    
    # 构建测试镜像
    print("🔨 构建测试镜像...")
    success, output = run_command("docker-compose -f docker-compose.test.yml build")
    if not success:
        print(f"❌ 构建失败: {output}")
        return 1
    
    # 运行测试
    print("📋 运行单元测试...")
    success, output = run_command("docker-compose -f docker-compose.test.yml up --abort-on-container-exit")
    
    # 获取测试结果
    success_get_exit, exit_code_output = run_command("docker-compose -f docker-compose.test.yml ps -q test")
    if success_get_exit and exit_code_output.strip():
        container_id = exit_code_output.strip()
        success_inspect, inspect_output = run_command(f"docker inspect -f '{{{{.State.ExitCode}}}}' {container_id}")
        if success_inspect:
            try:
                test_exit_code = int(inspect_output.strip())
            except ValueError:
                test_exit_code = 1
        else:
            test_exit_code = 1
    else:
        test_exit_code = 1
    
    # 清理容器
    print("🧹 清理测试容器...")
    run_command("docker-compose -f docker-compose.test.yml down -v")
    
    # 输出结果
    if test_exit_code == 0:
        print("✅ 所有测试通过!")
        print(output)
        return 0
    else:
        print("❌ 测试失败:")
        print(output)
        return 1

if __name__ == "__main__":
    sys.exit(main()) 