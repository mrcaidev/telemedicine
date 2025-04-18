FROM openjdk:17-slim

WORKDIR /app

# build context 为 ./medical-appointment，复制构建产物
COPY target/medical-appointment.jar app.jar

EXPOSE 8083
ENV TZ=Asia/Shanghai

ENTRYPOINT ["java", "-jar", "app.jar"]
