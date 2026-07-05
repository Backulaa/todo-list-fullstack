package com.example.todo.modules.todo.application;

import com.example.todo.modules.todo.application.dto.request.TodoRequest;
import com.example.todo.modules.todo.application.dto.request.TodoUpdateRequest;
import com.example.todo.modules.todo.application.dto.response.TodoResponse;
import com.example.todo.modules.todo.domain.Todo;
import com.example.todo.modules.todo.infrastructure.TodoRepository;
import com.example.todo.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceImplTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoServiceImpl todoService;

    @Test
    void getTodos_shouldReturnTodoPage() {
        Todo todo = createTodo();

        Pageable pageable = PageRequest.of(0, 10);
        Page<Todo> todoPage = new PageImpl<>(List.of(todo), pageable, 1);

        when(todoRepository.findAll(
                ArgumentMatchers.<Specification<Todo>>any(),
                any(Pageable.class))).thenReturn(todoPage);

        Page<TodoResponse> result = todoService.getTodos("spring", false, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).title()).isEqualTo(todo.getTitle());
        assertThat(result.getContent().get(0).completed()).isFalse();

        verify(todoRepository).findAll(
                ArgumentMatchers.<Specification<Todo>>any(),
                eq(pageable));
    }

    @Test
    void getTodoById_whenTodoExists_shouldReturnTodo() {
        Todo todo = createTodo();

        when(todoRepository.findById(todo.getId())).thenReturn(Optional.of(todo));

        TodoResponse result = todoService.getTodoById(todo.getId());

        assertThat(result.id()).isEqualTo(todo.getId());
        assertThat(result.title()).isEqualTo("Learn Spring Boot");
        assertThat(result.description()).isEqualTo("Build Todo API");
        assertThat(result.completed()).isFalse();

        verify(todoRepository).findById(todo.getId());
    }

    @Test
    void getTodoById_whenTodoNotFound_shouldThrowResourceNotFoundException() {
        UUID id = UUID.randomUUID();

        when(todoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> todoService.getTodoById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Todo not found with id");

        verify(todoRepository).findById(id);
    }

    @Test
    void createTodo_shouldTrimTitleAndSaveTodo() {
        TodoRequest request = new TodoRequest("  New Todo  ", "  Description  ");

        Todo savedTodo = Todo.builder()
                .id(UUID.randomUUID())
                .title("New Todo")
                .description("Description")
                .completed(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoRepository.save(any(Todo.class))).thenReturn(savedTodo);

        TodoResponse result = todoService.createTodo(request);

        assertThat(result.title()).isEqualTo("New Todo");
        assertThat(result.description()).isEqualTo("Description");
        assertThat(result.completed()).isFalse();

        verify(todoRepository).save(any(Todo.class));
    }

    @Test
    void createTodo_whenDescriptionIsBlank_shouldSaveDescriptionAsNull() {
        TodoRequest request = new TodoRequest("New Todo", "   ");

        Todo savedTodo = Todo.builder()
                .id(UUID.randomUUID())
                .title("New Todo")
                .description(null)
                .completed(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoRepository.save(any(Todo.class))).thenReturn(savedTodo);

        TodoResponse result = todoService.createTodo(request);

        assertThat(result.title()).isEqualTo("New Todo");
        assertThat(result.description()).isNull();

        verify(todoRepository).save(any(Todo.class));
    }

    @Test
    void updateTodo_whenTodoExists_shouldUpdateTodo() {
        Todo todo = createTodo();

        TodoUpdateRequest request = new TodoUpdateRequest(
                "  Updated Todo  ",
                "  Updated Description  ");

        Todo updatedTodo = Todo.builder()
                .id(todo.getId())
                .title("Updated Todo")
                .description("Updated Description")
                .completed(false)
                .createdAt(todo.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoRepository.findById(todo.getId())).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(updatedTodo);

        TodoResponse result = todoService.updateTodo(todo.getId(), request);

        assertThat(result.id()).isEqualTo(todo.getId());
        assertThat(result.title()).isEqualTo("Updated Todo");
        assertThat(result.description()).isEqualTo("Updated Description");

        verify(todoRepository).findById(todo.getId());
        verify(todoRepository).save(todo);
    }

    @Test
    void updateCompletedStatus_whenTodoExists_shouldUpdateCompletedStatus() {
        Todo todo = createTodo();

        Todo completedTodo = Todo.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .completed(true)
                .createdAt(todo.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        when(todoRepository.findById(todo.getId())).thenReturn(Optional.of(todo));
        when(todoRepository.save(any(Todo.class))).thenReturn(completedTodo);

        TodoResponse result = todoService.updateCompletedStatus(todo.getId(), true);

        assertThat(result.completed()).isTrue();

        verify(todoRepository).findById(todo.getId());
        verify(todoRepository).save(todo);
    }

    @Test
    void deleteTodo_whenTodoExists_shouldDeleteTodo() {
        Todo todo = createTodo();

        when(todoRepository.findById(todo.getId())).thenReturn(Optional.of(todo));

        todoService.deleteTodo(todo.getId());

        verify(todoRepository).findById(todo.getId());
        verify(todoRepository).delete(todo);
    }

    @Test
    void deleteTodo_whenTodoNotFound_shouldThrowResourceNotFoundException() {
        UUID id = UUID.randomUUID();

        when(todoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> todoService.deleteTodo(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Todo not found with id");

        verify(todoRepository).findById(id);
        verify(todoRepository, never()).delete(any(Todo.class));
    }

    private Todo createTodo() {
        LocalDateTime now = LocalDateTime.now();

        return Todo.builder()
                .id(UUID.randomUUID())
                .title("Learn Spring Boot")
                .description("Build Todo API")
                .completed(false)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }
}