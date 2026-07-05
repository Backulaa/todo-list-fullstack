package com.example.todo.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI todoOpenAPI() {
        Server localServer = new Server()
                .url("http://localhost:8080")
                .description("Local server");

        Contact contact = new Contact()
                .name("Todo App")
                .email("your-email@example.com");

        Info info = new Info()
                .title("Todo List API")
                .version("1.0.0")
                .description("REST API for Todo List application built with Spring Boot, PostgreSQL and Docker.")
                .contact(contact)
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"));

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer));
    }
}