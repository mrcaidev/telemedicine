FROM openjdk:17-slim

WORKDIR /app

# Copy the jar file
COPY target/medical-appointment.jar app.jar

EXPOSE 8084
ENV TZ=Asia/Shanghai

ENTRYPOINT ["java", "-jar", "app.jar"]