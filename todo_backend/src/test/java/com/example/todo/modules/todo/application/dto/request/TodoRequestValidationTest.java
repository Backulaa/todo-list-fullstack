package com.example.todo.modules.todo.application.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class TodoRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void todoRequest_whenTitleIsBlank_shouldHaveValidationError() {
        TodoRequest request = new TodoRequest("", "Description");

        Set<ConstraintViolation<TodoRequest>> violations = validator.validate(request);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage())
                .isEqualTo("Title is required");
    }

    @Test
    void todoRequest_whenTitleIsLongerThan255_shouldHaveValidationError() {
        String longTitle = "a".repeat(256);

        TodoRequest request = new TodoRequest(longTitle, "Description");

        Set<ConstraintViolation<TodoRequest>> violations = validator.validate(request);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage())
                .isEqualTo("Title must not exceed 255 characters");
    }

    @Test
    void todoRequest_whenValid_shouldHaveNoValidationError() {
        TodoRequest request = new TodoRequest("Learn Spring Boot", "Description");

        Set<ConstraintViolation<TodoRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }
}