#FROM openjdk:17-slim
#
#WORKDIR /app
#
## Copy the jar file
#
#COPY target/medical-record-1.0-SNAPSHOT.jar /app/app.jar
#
#
#EXPOSE 8082
#ENV TZ=Asia/Shanghai
#
#ENTRYPOINT ["java", "-jar", "app.jar"]
FROM maven:amazoncorretto AS builder
WORKDIR /code
COPY pom.xml .
COPY . .
RUN mvn clean package -DskipTests

FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=builder /code/target/*.jar app.jar
ENV TZ=Asia/Singapore
CMD ["java", "-jar", "app.jar"]