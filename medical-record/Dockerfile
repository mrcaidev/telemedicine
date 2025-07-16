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
