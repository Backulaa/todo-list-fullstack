package com.example.todo.modules.todo.application.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class TodoUpdateRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void todoUpdateRequest_whenTitleIsBlank_shouldHaveValidationError() {
        TodoUpdateRequest request = new TodoUpdateRequest("   ", "Description");

        Set<ConstraintViolation<TodoUpdateRequest>> violations = validator.validate(request);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage())
                .isEqualTo("Title is required");
    }

    @Test
    void todoUpdateRequest_whenTitleIsLongerThan255_shouldHaveValidationError() {
        String longTitle = "a".repeat(256);

        TodoUpdateRequest request = new TodoUpdateRequest(longTitle, "Description");

        Set<ConstraintViolation<TodoUpdateRequest>> violations = validator.validate(request);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage())
                .isEqualTo("Title must not exceed 255 characters");
    }

    @Test
    void todoUpdateRequest_whenValid_shouldHaveNoValidationError() {
        TodoUpdateRequest request = new TodoUpdateRequest("Updated Todo", "Updated Description");

        Set<ConstraintViolation<TodoUpdateRequest>> violations = validator.validate(request);

        assertThat(violations).isEmpty();
    }
}