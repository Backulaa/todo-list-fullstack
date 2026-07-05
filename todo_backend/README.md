# Todo Backend

Backend service for Todo List application built with Spring Boot, PostgreSQL and Docker.

## Features

- Create todo
- Get todo list
- Get todo detail
- Update todo
- Delete todo
- Mark todo as completed or pending
- Search todos by keyword
- Filter todos by status
- Pagination and sorting
- Global exception handling
- Request validation
- Swagger API documentation
- Database migration with Flyway
- Dockerized backend and PostgreSQL

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Web
- Spring Data JPA
- PostgreSQL
- Flyway Migration
- Lombok
- Springdoc OpenAPI
- Docker
- Docker Compose

## Architecture

This backend uses Modular Monolith with Layered Architecture.
```text
src/main/java/com/example/todo
├── TodoApplication.java
├── modules
│   └── todo
│       ├── presentation
│       │   └── TodoController.java
│       ├── application
│       │   ├── TodoService.java
│       │   ├── TodoServiceImpl.java
│       │   └── dto
│       ├── domain
│       │   └── Todo.java
│       └── infrastructure
│           └── TodoRepository.java
└── shared
    ├── config
    ├── exception
    └── response
```

### Layer Responsibilities
| Layer          | Responsibility                                          |
| -------------- | ------------------------------------------------------- |
| Presentation   | Handles HTTP requests and responses                     |
| Application    | Contains business logic and use cases                   |
| Domain         | Contains main business model                            |
| Infrastructure | Handles database access                                 |
| Shared         | Contains common config, response and exception handling |

## Database

Database: PostgreSQL

Table: todos
```text
CREATE TABLE todos (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```
## Environment Variables

Create .env file and the backend uses these environment variables:

    POSTGRES_DB=todo_db
    POSTGRES_USER=todo_user
    POSTGRES_PASSWORD=todo_password
    POSTGRES_PORT=5432
    APP_PORT=8080

When running inside Docker Compose, backend connects to PostgreSQL using:
    jdbc:postgresql://postgres:5432/todo_db

## Run with Docker Compose

From backend folder:

    docker compose up -d --build

# Run Locally Without Docker

Make sure PostgreSQL is running first.

Then run:

    mvn spring-boot:run

Or build:

    mvn clean package -DskipTests

Run jar:

    java -jar target/todo-0.0.1-SNAPSHOT.jar

## Swagger

Swagger UI:

    http://localhost:8080/swagger-ui.html

OpenAPI docs:

    http://localhost:8080/api-docs

## Run Unit Tests
Run all unit tests:

```bash
mvn test