FROM openjdk:17-slim

WORKDIR /app

# 在 build context 为 ./medical-eureka-server 时有效
COPY target/medical-eureka-server.jar app.jar

EXPOSE 8761
ENV TZ=Asia/Shanghai

ENTRYPOINT ["java", "-jar", "app.jar"]
