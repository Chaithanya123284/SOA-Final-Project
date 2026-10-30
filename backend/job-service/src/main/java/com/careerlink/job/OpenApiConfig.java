package com.careerlink.job;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI careerLinkJobOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CareerLink Networks - Job Service API")
                        .description("Job Catalog, Search and Filtering, Applicant Counts - PostgreSQL (PS015)")
                        .version("1.0.0")
                        .contact(new Contact().name("CareerLink Networks")));
    }
}
