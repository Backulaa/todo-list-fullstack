package com.example.todo.modules.todo.presentation;

import com.example.todo.modules.todo.application.TodoService;
import com.example.todo.modules.todo.application.dto.request.TodoRequest;
import com.example.todo.modules.todo.application.dto.request.TodoUpdateRequest;
import com.example.todo.modules.todo.application.dto.response.TodoResponse;
import com.example.todo.shared.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TodoService todoService;

    @Test
    void getTodos_shouldReturnTodoPage() throws Exception {
        TodoResponse todo = createTodoResponse();

        when(todoService.getTodos(
                eq("spring"),
                eq(false),
                ArgumentMatchers.any(Pageable.class))).thenReturn(new PageImpl<>(List.of(todo)));

        mockMvc.perform(get("/api/v1/todos")
                .param("keyword", "spring")
                .param("completed", "false")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Get todos successfully"))
                .andExpect(jsonPath("$.data.content[0].title").value(todo.title()))
                .andExpect(jsonPath("$.data.content[0].completed").value(false));

        verify(todoService).getTodos(
                eq("spring"),
                eq(false),
                ArgumentMatchers.any(Pageable.class));
    }

    @Test
    void getTodoById_shouldReturnTodo() throws Exception {
        TodoResponse todo = createTodoResponse();

        when(todoService.getTodoById(todo.id())).thenReturn(todo);

        mockMvc.perform(get("/api/v1/todos/{id}", todo.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Get todo successfully"))
                .andExpect(jsonPath("$.data.id").value(todo.id().toString()))
                .andExpect(jsonPath("$.data.title").value(todo.title()));

        verify(todoService).getTodoById(todo.id());
    }

    @Test
    void createTodo_whenRequestIsValid_shouldReturnCreatedTodo() throws Exception {
        TodoRequest request = new TodoRequest("Learn Spring Boot", "Build API");
        TodoResponse response = createTodoResponse();

        when(todoService.createTodo(any(TodoRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/todos")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Create todo successfully"))
                .andExpect(jsonPath("$.data.title").value(response.title()));

        verify(todoService).createTodo(any(TodoRequest.class));
    }

    @Test
    void createTodo_whenTitleIsBlank_shouldReturnBadRequest() throws Exception {
        TodoRequest request = new TodoRequest("", "Build API");

        mockMvc.perform(post("/api/v1/todos")
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.title").value("Title is required"));

        verify(todoService, never()).createTodo(any(TodoRequest.class));
    }

    @Test
    void updateTodo_whenRequestIsValid_shouldReturnUpdatedTodo() throws Exception {
        UUID id = UUID.randomUUID();

        TodoUpdateRequest request = new TodoUpdateRequest(
                "Updated Todo",
                "Updated Description");

        TodoResponse response = new TodoResponse(
                id,
                "Updated Todo",
                "Updated Description",
                false,
                LocalDateTime.now(),
                LocalDateTime.now());

        when(todoService.updateTodo(eq(id), any(TodoUpdateRequest.class)))
                .thenReturn(response);

        mockMvc.perform(put("/api/v1/todos/{id}", id)
                .contentType(APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Update todo successfully"))
                .andExpect(jsonPath("$.data.title").value("Updated Todo"));

        verify(todoService).updateTodo(eq(id), any(TodoUpdateRequest.class));
    }

    @Test
    void updateCompletedStatus_shouldReturnUpdatedTodo() throws Exception {
        UUID id = UUID.randomUUID();

        TodoResponse response = new TodoResponse(
                id,
                "Learn Spring Boot",
                "Build API",
                true,
                LocalDateTime.now(),
                LocalDateTime.now());

        when(todoService.updateCompletedStatus(id, true)).thenReturn(response);

        mockMvc.perform(patch("/api/v1/todos/{id}/completed", id)
                .param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Update todo status successfully"))
                .andExpect(jsonPath("$.data.completed").value(true));

        verify(todoService).updateCompletedStatus(id, true);
    }

    @Test
    void deleteTodo_shouldReturnSuccessMessage() throws Exception {
        UUID id = UUID.randomUUID();

        doNothing().when(todoService).deleteTodo(id);

        mockMvc.perform(delete("/api/v1/todos/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Delete todo successfully"));

        verify(todoService).deleteTodo(id);
    }

    private TodoResponse createTodoResponse() {
        return new TodoResponse(
                UUID.randomUUID(),
                "Learn Spring Boot",
                "Build API",
                false,
                LocalDateTime.now(),
                LocalDateTime.now());
    }
}