# 使用轻量 JDK 运行环境
FROM openjdk:17-slim

WORKDIR /app

# 只复制已构建好的 jar 文件（注意路径）
COPY target/medical-user-1.0-SNAPSHOT.jar /app/app.jar

EXPOSE 8081
ENV TZ=Asia/Shanghai

ENTRYPOINT ["java", "-jar", "app.jar"]

