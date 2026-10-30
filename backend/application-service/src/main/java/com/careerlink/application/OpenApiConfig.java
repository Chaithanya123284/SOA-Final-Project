package com.careerlink.application;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI careerLinkApplicationOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CareerLink Networks - Application Service API")
                        .description("Job Applications, Recruiter Status Reviews and Notes - PostgreSQL (PS015)")
                        .version("1.0.0")
                        .contact(new Contact().name("CareerLink Networks")));
    }
}
