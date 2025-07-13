# 智能助手项目测试指南

## 测试方式

### 1. 本地测试（原有方式）

```bash
# 运行所有测试
python run_tests.py

# 或者直接使用pytest
python -m pytest tests/ -v

# 运行特定测试文件
python -m pytest tests/test_assistant.py -v

# 运行特定测试函数
python -m pytest tests/test_assistant.py::test_assistant_creation -v
```

### 2. Docker测试（推荐方式）

#### 使用Docker Compose运行测试

```bash
# 运行所有测试
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# 或者使用脚本（Linux/Mac）
./scripts/run_tests_docker.sh

# Windows PowerShell
.\scripts\run_tests_docker.ps1
```

#### 手动构建和运行

```bash
# 构建测试镜像
docker-compose -f docker-compose.test.yml build

# 运行测试
docker-compose -f docker-compose.test.yml up test

# 清理测试环境
docker-compose -f docker-compose.test.yml down -v
```

## 测试环境配置

### Docker测试环境变量

Docker测试使用以下环境变量（来自docker-compose.test.yml）：

- `AGENT_ACCESS_KEY`: OpenAI API密钥
- `MONGO_URL`: MongoDB连接URL
- `REDIS_URL`: Redis连接URL
- `PYTHONPATH`: Python模块搜索路径

### 测试依赖服务

Docker测试会自动启动以下服务：

- **Redis**: 端口6380（避免与开发环境冲突）
- **MongoDB**: 端口27018（避免与开发环境冲突）

## 测试文件结构

```
tests/
├── conftest.py          # pytest配置文件
├── test_assistant.py    # 助手功能测试
├── test_config.py       # 配置测试
├── test_httpMiddleware.py # HTTP中间件测试
├── test_redisUtils.py   # Redis工具测试
├── test_simple.py       # 简单功能测试
└── test_utils.py        # 工具函数测试
```

## 测试最佳实践

1. **使用Docker测试**: 确保测试环境与生产环境一致
2. **隔离测试**: 每个测试应该独立运行，不依赖其他测试
3. **清理资源**: 测试完成后清理数据库和缓存
4. **环境变量**: 使用环境变量而不是硬编码配置

## 故障排除

### 常见问题

1. **Docker未运行**: 确保Docker Desktop已启动
2. **端口冲突**: 测试环境使用不同端口避免冲突
3. **环境变量缺失**: 确保设置了必要的环境变量
4. **网络问题**: 检查Docker网络配置

### 调试命令

```bash
# 查看测试容器日志
docker-compose -f docker-compose.test.yml logs test

# 进入测试容器调试
docker-compose -f docker-compose.test.yml run --rm test bash

# 查看测试环境状态
docker-compose -f docker-compose.test.yml ps
``` 