# Docker单元测试快速使用指南

## 🚀 快速开始

### 1. 确保Docker环境准备就绪

```bash
# 检查Docker是否安装
docker --version

# 检查Docker是否运行
docker info

# 检查docker-compose是否可用
docker-compose --version
```

### 2. 运行Docker测试

#### 方式一：使用Python脚本（推荐）
```bash
python run_tests_docker.py
```

#### 方式二：使用docker-compose命令
```bash
# 运行所有测试
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# 构建并运行
docker-compose -f docker-compose.test.yml build
docker-compose -f docker-compose.test.yml up test
```

#### 方式三：使用Shell脚本
```bash
# Linux/Mac
./scripts/run_tests_docker.sh

# Windows PowerShell
.\scripts\run_tests_docker.ps1
```

## 📋 测试环境说明

### 环境变量
测试环境会自动使用以下环境变量：
- `AGENT_ACCESS_KEY`: 从你的环境变量中获取
- `MONGO_URL`: 自动连接到测试MongoDB容器
- `REDIS_URL`: 自动连接到测试Redis容器

### 端口配置
- **Redis**: 6380 (避免与开发环境6379冲突)
- **MongoDB**: 27018 (避免与开发环境27017冲突)

## 🔧 常用命令

### 查看测试日志
```bash
docker-compose -f docker-compose.test.yml logs test
```

### 进入测试容器调试
```bash
docker-compose -f docker-compose.test.yml run --rm test bash
```

### 清理测试环境
```bash
docker-compose -f docker-compose.test.yml down -v
```

### 重新构建测试镜像
```bash
docker-compose -f docker-compose.test.yml build --no-cache
```

## 🐛 故障排除

### 问题1：Docker未运行
**错误**: `Docker 未运行，请先启动Docker Desktop`
**解决**: 启动Docker Desktop应用程序

### 问题2：端口冲突
**错误**: `port is already allocated`
**解决**: 停止其他使用相同端口的服务，或修改`docker-compose.test.yml`中的端口

### 问题3：环境变量缺失
**错误**: `AGENT_ACCESS_KEY not found`
**解决**: 确保设置了`OPENAI_API_KEY`环境变量

### 问题4：构建失败
**错误**: `failed to build`
**解决**: 检查网络连接，或使用`--no-cache`重新构建

## 📊 测试结果

测试完成后会显示：
- ✅ 所有测试通过
- ❌ 测试失败（包含详细错误信息）

## 🔄 与本地测试的区别

| 特性 | 本地测试 | Docker测试 |
|------|----------|------------|
| 环境隔离 | ❌ 依赖本地环境 | ✅ 完全隔离 |
| 依赖管理 | 需要手动安装 | 自动安装 |
| 环境一致性 | 可能不一致 | 完全一致 |
| 启动速度 | 快 | 稍慢（需要构建） |
| 清理 | 手动清理 | 自动清理 |

## 🎯 最佳实践

1. **开发阶段**: 使用本地测试快速反馈
2. **提交前**: 使用Docker测试确保环境一致性
3. **CI/CD**: 使用Docker测试进行自动化测试
4. **调试**: 使用`docker-compose run --rm test bash`进入容器调试 