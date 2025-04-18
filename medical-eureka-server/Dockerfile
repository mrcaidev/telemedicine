# 构建阶段
FROM maven:3.8.4-openjdk-17-slim AS builder

# 设置工作目录
WORKDIR /app

# 复制整个项目
COPY . .

# 构建项目
RUN mvn clean package -DskipTests

# 运行阶段
FROM openjdk:17-slim

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/medical-gateway/target/medical-gateway.jar ./app.jar

# 暴露端口
EXPOSE 8080

# 设置时区
ENV TZ=Asia/Shanghai

# 设置启动命令
ENTRYPOINT ["java", "-jar", "app.jar"] 