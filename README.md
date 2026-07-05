# Todo List Application

A full-stack Todo List application built with React, Spring Boot, PostgreSQL and Docker.

This project allows users to manage daily tasks with basic CRUD features, status filtering, keyword search and pagination.

## Features

- View todo list
- Create a new todo
- Update todo information
- Delete todo
- Mark todo as completed or pending
- Search todos by keyword
- Filter todos by status
- Pagination
- Responsive UI
- API documentation with Swagger
- Backend and database dockerized with Docker Compose

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Hot Toast

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- PostgreSQL
- Flyway Migration
- Lombok
- Springdoc OpenAPI / Swagger

### DevOps

- Docker
- Docker Compose

## Project Structure
```text
todo
├── todo_backend
│   ├── src
│   ├── pom.xml
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
│
├── todo_frontend
│   ├── src
│   ├── package.json
│   └── README.md
│
└── README.md
```

## How to Run the Project
1. Run Backend and Database

Go to the backend folder:

    cd todo_backend

Start backend and PostgreSQL:

    docker compose up -d --build

Backend will run at:

    http://localhost:8080

Swagger UI:

    http://localhost:8080/swagger-ui.html

2. Run Frontend

Open another terminal and go to the frontend folder:

    cd todo_frontend

Install dependencies:

    npm install

Run frontend:

    npm run dev

Frontend will run at:

    http://localhost:5173

## API Base URL

Frontend calls backend API through:

    /api/v1

During development, Vite proxy forwards API requests to:

http://localhost:8080

## Main API Endpoints
| Method | Endpoint                       | Description                                      |
| ------ | ------------------------------ | ------------------------------------------------ |
| GET    | `/api/v1/todos`                | Get todo list with search, filter and pagination |
| GET    | `/api/v1/todos/{id}`           | Get todo detail                                  |
| POST   | `/api/v1/todos`                | Create todo                                      |
| PUT    | `/api/v1/todos/{id}`           | Update todo                                      |
| PATCH  | `/api/v1/todos/{id}/completed` | Update completed status                          |
| DELETE | `/api/v1/todos/{id}`           | Delete todo                                      |


## Notes
    Backend and database are dockerized.
    Frontend runs locally with Vite during development.
    PostgreSQL data is stored in Docker volume.
    Flyway is used to manage database migration.
