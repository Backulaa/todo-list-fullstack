package com.example.todo.modules.todo.application.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record TodoResponse(
        UUID id,
        String title,
        String description,
        boolean completed,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}