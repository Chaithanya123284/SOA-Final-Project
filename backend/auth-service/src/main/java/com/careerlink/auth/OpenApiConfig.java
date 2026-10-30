package com.careerlink.auth;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI careerLinkAuthOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CareerLink Networks - Auth Service API")
                        .description("JWT Authentication, Authorization, User Registration and Identity Management (PS015)")
                        .version("1.0.0")
                        .contact(new Contact().name("CareerLink Networks")));
    }
}
