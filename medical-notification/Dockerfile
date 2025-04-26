FROM openjdk:17-slim

WORKDIR /app

# Copy the jar file
COPY target/medical-notification-1.0-SNAPSHOT.jar /app/app.jar

EXPOSE 8085
ENV TZ=Asia/Shanghai

ENTRYPOINT ["java", "-jar", "app.jar"]