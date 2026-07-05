package com.example.todo.modules.todo.application;

import com.example.todo.modules.todo.application.dto.request.TodoRequest;
import com.example.todo.modules.todo.application.dto.request.TodoUpdateRequest;
import com.example.todo.modules.todo.application.dto.response.TodoResponse;
import com.example.todo.modules.todo.domain.Todo;
import com.example.todo.modules.todo.infrastructure.TodoRepository;
import com.example.todo.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<TodoResponse> getTodos(String keyword, Boolean completed, Pageable pageable) {
        Specification<Todo> spec = Specification.unrestricted();
        if (keyword != null && !keyword.isBlank()) {
            String searchKeyword = keyword.trim().toLowerCase();

            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + searchKeyword + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + searchKeyword + "%")));
        }

        if (completed != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("completed"), completed));
        }

        return todoRepository.findAll(spec, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TodoResponse getTodoById(UUID id) {
        Todo todo = findTodoById(id);
        return toResponse(todo);
    }

    @Override
    @Transactional
    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = Todo.builder()
                .title(request.title().trim())
                .description(normalizeText(request.description()))
                .completed(false)
                .build();

        Todo savedTodo = todoRepository.save(todo);
        return toResponse(savedTodo);
    }

    @Override
    @Transactional
    public TodoResponse updateTodo(UUID id, TodoUpdateRequest request) {
        Todo todo = findTodoById(id);

        todo.setTitle(request.title().trim());
        todo.setDescription(normalizeText(request.description()));

        Todo updatedTodo = todoRepository.save(todo);
        return toResponse(updatedTodo);
    }

    @Override
    @Transactional
    public TodoResponse updateCompletedStatus(UUID id, boolean completed) {
        Todo todo = findTodoById(id);

        todo.setCompleted(completed);

        Todo updatedTodo = todoRepository.save(todo);
        return toResponse(updatedTodo);
    }

    @Override
    @Transactional
    public void deleteTodo(UUID id) {
        Todo todo = findTodoById(id);
        todoRepository.delete(todo);
    }

    private Todo findTodoById(UUID id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
    }

    private TodoResponse toResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.isCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt());
    }

    private String normalizeText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}