#!/bin/bash

# Docker测试运行脚本
echo "🚀 启动Docker单元测试..."
echo "=" * 50

# 检查docker-compose是否可用
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose 未安装或不在PATH中"
    exit 1
fi

# 检查Docker是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker 未运行，请先启动Docker"
    exit 1
fi

# 停止并清理之前的测试容器
echo "🧹 清理之前的测试容器..."
docker-compose -f docker-compose.test.yml down -v

# 构建测试镜像
echo "🔨 构建测试镜像..."
docker-compose -f docker-compose.test.yml build

# 运行测试
echo "📋 运行单元测试..."
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# 获取测试结果
TEST_EXIT_CODE=$(docker-compose -f docker-compose.test.yml ps -q test | xargs docker inspect -f '{{.State.ExitCode}}')

# 清理容器
echo "🧹 清理测试容器..."
docker-compose -f docker-compose.test.yml down -v

# 输出结果
if [ "$TEST_EXIT_CODE" -eq 0 ]; then
    echo "✅ 所有测试通过!"
    exit 0
else
    echo "❌ 测试失败，退出码: $TEST_EXIT_CODE"
    exit 1
fi 