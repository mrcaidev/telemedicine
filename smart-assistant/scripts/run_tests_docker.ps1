# Docker测试运行脚本 (PowerShell版本)
Write-Host "🚀 启动Docker单元测试..." -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

# 检查docker-compose是否可用
try {
    $null = Get-Command docker-compose -ErrorAction Stop
} catch {
    Write-Host "❌ docker-compose 未安装或不在PATH中" -ForegroundColor Red
    exit 1
}

# 检查Docker是否运行
try {
    $null = docker info 2>$null
} catch {
    Write-Host "❌ Docker 未运行，请先启动Docker" -ForegroundColor Red
    exit 1
}

# 停止并清理之前的测试容器
Write-Host "🧹 清理之前的测试容器..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml down -v

# 构建测试镜像
Write-Host "🔨 构建测试镜像..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml build

# 运行测试
Write-Host "📋 运行单元测试..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# 获取测试结果
$testContainer = docker-compose -f docker-compose.test.yml ps -q test
if ($testContainer) {
    $exitCode = docker inspect -f '{{.State.ExitCode}}' $testContainer
} else {
    $exitCode = 1
}

# 清理容器
Write-Host "🧹 清理测试容器..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml down -v

# 输出结果
if ($exitCode -eq 0) {
    Write-Host "✅ 所有测试通过!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ 测试失败，退出码: $exitCode" -ForegroundColor Red
    exit 1
} 