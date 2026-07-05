package com.example.todo.modules.todo.application;

import com.example.todo.modules.todo.application.dto.request.TodoRequest;
import com.example.todo.modules.todo.application.dto.request.TodoUpdateRequest;
import com.example.todo.modules.todo.application.dto.response.TodoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TodoService {

    Page<TodoResponse> getTodos(String keyword, Boolean completed, Pageable pageable);

    TodoResponse getTodoById(UUID id);

    TodoResponse createTodo(TodoRequest request);

    TodoResponse updateTodo(UUID id, TodoUpdateRequest request);

    TodoResponse updateCompletedStatus(UUID id, boolean completed);

    void deleteTodo(UUID id);
}