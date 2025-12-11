package com.company.golive.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Go-Live Management System API")
                        .version("1.0.0")
                        .description(
                                "Production-ready API for managing change requests, service deployments, and dependency tracking")
                        .contact(new Contact()
                                .name("Platform Team")
                                .email("platform@company.com")));
    }
}
