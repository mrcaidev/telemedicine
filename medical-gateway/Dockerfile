FROM openjdk:17-slim

WORKDIR /app

# Copy the jar file
COPY target/medical-gateway.jar app.jar

EXPOSE 8080
ENV TZ=Asia/Shanghai

ENTRYPOINT ["java", "-jar", "app.jar"]