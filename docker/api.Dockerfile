# syntax=docker/dockerfile:1.7

FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY api/pom.xml ./pom.xml
COPY api/mvnw ./mvnw
COPY api/.mvn ./.mvn
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline

COPY api/src ./src
RUN ./mvnw -q -DskipTests clean package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/app.jar ./app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
