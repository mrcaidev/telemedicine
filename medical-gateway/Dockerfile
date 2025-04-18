# 运行阶段
FROM openjdk:17-slim

WORKDIR /app

# 此处 build context 是 ./medical-gateway
COPY target/medical-gateway.jar app.jar

EXPOSE 8080
ENV TZ=Asia/Shanghai

ENTRYPOINT ["java", "-jar", "app.jar"]
