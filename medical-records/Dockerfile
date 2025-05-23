FROM openjdk:17-slim

WORKDIR /app

# Copy the jar file
COPY target/medical-records-1.0-SNAPSHOT.jar /app/app.jar

EXPOSE 8082
ENV TZ=Asia/Shanghai

ENTRYPOINT ["java", "-jar", "app.jar"]