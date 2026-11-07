# Multi-stage Docker build for Spring Boot Backend

# Stage 1: Build the JAR
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /workspace
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal JRE Runtime
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Add non-root system user for security
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

COPY --from=builder /workspace/target/*.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=postgres \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
