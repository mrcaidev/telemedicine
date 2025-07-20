# 智能助手项目单元测试指南

## 概述

本项目包含完整的单元测试套件，使用 `pytest` 框架进行测试。测试覆盖了数据模型、响应代码、HTTP中间件、Redis工具、助手模块和API集成测试。

## 环境准备

### 1. 安装测试依赖

```bash
# 安装pytest和相关插件
pip install pytest pytest-asyncio httpx python-dotenv

# 或者使用requirements文件
pip install -r requirements.txt
```

### 2. 配置测试环境

创建测试环境配置文件 `.env.test`（可选）：

```bash
# 测试环境配置
REDIS_URL=redis://localhost:6379/1
MONGO_URL=mongodb://localhost:27017/test_db
OPENAI_API_KEY=test_openai_api_key
AGENT_ACCESS_KEY=test_key
DEBUG=true
ENVIRONMENT=test
```

## 运行测试

### 基本命令

```bash
# 运行所有测试
python -m pytest

# 运行测试并显示详细信息
python -m pytest -v

# 运行测试并显示输出
python -m pytest -s

# 运行测试并显示详细信息及输出
python -m pytest -v -s
```

### 运行特定测试

```bash
# 运行特定测试文件
python -m pytest tests/test_models.py

# 运行特定测试类
python -m pytest tests/test_httpMiddleware.py::TestHttpMiddleware

# 运行特定测试方法
python -m pytest tests/test_httpMiddleware.py::TestHttpMiddleware::test_validate_request_header_success

# 运行包含特定关键字的测试
python -m pytest -k "httpMiddleware"
```

### 运行测试目录

```bash
# 运行tests目录下的所有测试
python -m pytest tests/

# 运行特定目录下的测试
python -m pytest tests/unit/
```

### 测试覆盖率

```bash
# 安装pytest-cov
pip install pytest-cov

# 运行测试并生成覆盖率报告
python -m pytest --cov=app tests/

# 生成HTML覆盖率报告
python -m pytest --cov=app --cov-report=html tests/
```

## 测试文件结构

```
tests/
├── __init__.py
├── conftest.py              # pytest配置文件
├── test_config.py           # 测试配置模块
├── test_simple.py           # 简单测试验证
├── test_models.py           # 数据模型测试
├── test_respCode.py         # 响应代码测试
├── test_httpMiddleware.py   # HTTP中间件测试
├── test_redisUtils.py       # Redis工具测试
├── test_assistant.py        # 助手模块测试
├── test_app_integration.py  # API集成测试
└── test_utils.py            # 工具函数测试
```

## 测试类型说明

### 1. 单元测试 (Unit Tests)

测试独立的函数和类：

```bash
# 运行单元测试
python -m pytest tests/test_models.py tests/test_respCode.py tests/test_httpMiddleware.py
```

### 2. 集成测试 (Integration Tests)

测试模块间的交互：

```bash
# 运行集成测试
python -m pytest tests/test_redisUtils.py tests/test_assistant.py
```

### 3. API测试 (API Tests)

测试API端点：

```bash
# 运行API测试
python -m pytest tests/test_app_integration.py
```

### 4. 异步测试 (Async Tests)

测试异步函数：

```bash
# 运行异步测试
python -m pytest tests/test_httpMiddleware.py tests/test_redisUtils.py
```

## 测试标记

使用pytest标记来分类测试：

```bash
# 运行标记为unit的测试
python -m pytest -m unit

# 运行标记为integration的测试
python -m pytest -m integration

# 运行标记为slow的测试
python -m pytest -m slow

# 跳过标记为slow的测试
python -m pytest -m "not slow"
```

## 调试测试

### 1. 详细输出

```bash
# 显示详细的测试输出
python -m pytest -v -s

# 显示最详细的输出
python -m pytest -vvv -s
```

### 2. 失败时停止

```bash
# 遇到第一个失败就停止
python -m pytest -x

# 遇到第一个失败就停止并显示详细信息
python -m pytest -x -v -s
```

### 3. 调试模式

```bash
# 在失败时进入pdb调试器
python -m pytest --pdb

# 在失败时进入pdb调试器并显示详细信息
python -m pytest --pdb -v -s
```

## 测试配置

### pytest.ini 配置

```ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v -s
markers =
    unit: Unit tests
    integration: Integration tests
    slow: Slow running tests
```

### conftest.py 配置

测试配置文件会自动加载环境变量：

```python
# 优先级顺序：
1. .env.test      # 测试专用配置
2. .env.local     # 本地开发配置  
3. .env           # 默认配置
```

## 常见问题

### Q: 测试导入模块失败怎么办？
A: 确保在项目根目录运行测试：
```bash
cd /path/to/smart-assistant
python -m pytest
```

### Q: 异步测试失败怎么办？
A: 确保安装了 `pytest-asyncio`：
```bash
pip install pytest-asyncio
```

### Q: 测试需要外部服务（Redis/MongoDB）怎么办？
A: 使用mock或启动测试服务：
```bash
# 使用Docker启动测试服务
docker-compose up -d redis mongo

# 或使用mock（推荐）
python -m pytest tests/test_redisUtils.py
```

### Q: 如何生成测试报告？
A: 使用pytest-html插件：
```bash
pip install pytest-html
python -m pytest --html=report.html --self-contained-html
```

## 持续集成

### GitHub Actions 示例

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest pytest-asyncio httpx
    - name: Run tests
      run: python -m pytest -v
```

## 最佳实践

1. **测试命名**：使用描述性的测试名称
2. **测试隔离**：每个测试应该独立运行
3. **Mock外部依赖**：避免依赖外部服务
4. **测试覆盖率**：保持高测试覆盖率
5. **快速反馈**：测试应该快速运行
6. **清晰断言**：使用清晰的断言消息

## 快速开始

```bash
# 1. 安装依赖
pip install pytest pytest-asyncio httpx python-dotenv

# 2. 运行简单测试验证
python -m pytest tests/test_simple.py -v

# 3. 运行所有测试
python -m pytest -v

# 4. 查看测试覆盖率
python -m pytest --cov=app tests/ -v
```

## 测试维护

- 定期运行测试：`python -m pytest`
- 检查测试覆盖率：`python -m pytest --cov=app`
- 更新测试文档：保持README-TEST.md最新
- 添加新测试：为新功能编写测试 