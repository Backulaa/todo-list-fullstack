package com.example.todo.shared.exception;

import com.example.todo.shared.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.Hidden;

@Hidden
@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ApiResponse<Void> handleResourceNotFound(ResourceNotFoundException ex) {
                return ApiResponse.error(ex.getMessage());
        }

        @ExceptionHandler(BadRequestException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ApiResponse<Void> handleBadRequest(BadRequestException ex) {
                return ApiResponse.error(ex.getMessage());
        }

        @ExceptionHandler(UnauthorizedException.class)
        @ResponseStatus(HttpStatus.UNAUTHORIZED)
        public ApiResponse<Void> handleUnauthorized(UnauthorizedException ex) {
                return ApiResponse.error(ex.getMessage());
        }

        @ExceptionHandler(ForbiddenException.class)
        @ResponseStatus(HttpStatus.FORBIDDEN)
        public ApiResponse<Void> handleForbidden(ForbiddenException ex) {
                return ApiResponse.error(ex.getMessage());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException ex) {
                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

                return ApiResponse.error("Validation failed", errors);
        }

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ApiResponse<Void> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
                return ApiResponse.error("Invalid parameter: " + ex.getName());
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ApiResponse<Void> handleInvalidRequestBody(HttpMessageNotReadableException ex) {
                return ApiResponse.error("Invalid request body");
        }

        // @ExceptionHandler(Exception.class)
        // @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
        // public ApiResponse<Void> handleGeneralException(Exception ex) {
        // return ApiResponse.error("Internal server error");
        // }
}