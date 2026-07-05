package com.example.todo.modules.todo.presentation;

import com.example.todo.modules.todo.application.TodoService;
import com.example.todo.modules.todo.application.dto.request.TodoRequest;
import com.example.todo.modules.todo.application.dto.request.TodoUpdateRequest;
import com.example.todo.modules.todo.application.dto.response.TodoResponse;
import com.example.todo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ApiResponse<Page<TodoResponse>> getTodos(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean completed,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<TodoResponse> todos = todoService.getTodos(keyword, completed, pageable);
        return ApiResponse.success("Get todos successfully", todos);
    }

    @GetMapping("/{id}")
    public ApiResponse<TodoResponse> getTodoById(@PathVariable UUID id) {
        TodoResponse todo = todoService.getTodoById(id);
        return ApiResponse.success("Get todo successfully", todo);
    }

    @PostMapping
    public ApiResponse<TodoResponse> createTodo(@Valid @RequestBody TodoRequest request) {
        TodoResponse todo = todoService.createTodo(request);
        return ApiResponse.success("Create todo successfully", todo);
    }

    @PutMapping("/{id}")
    public ApiResponse<TodoResponse> updateTodo(
            @PathVariable UUID id,
            @Valid @RequestBody TodoUpdateRequest request) {
        TodoResponse todo = todoService.updateTodo(id, request);
        return ApiResponse.success("Update todo successfully", todo);
    }

    @PatchMapping("/{id}/completed")
    public ApiResponse<TodoResponse> updateCompletedStatus(
            @PathVariable UUID id,
            @RequestParam boolean completed) {
        TodoResponse todo = todoService.updateCompletedStatus(id, completed);
        return ApiResponse.success("Update todo status successfully", todo);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTodo(@PathVariable UUID id) {
        todoService.deleteTodo(id);
        return ApiResponse.success("Delete todo successfully");
    }
}