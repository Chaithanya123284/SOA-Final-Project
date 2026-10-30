package com.careerlink.profile;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI careerLinkProfileOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CareerLink Networks - Profile Service API")
                        .description("Candidate Profiles, Resumes, Skills and Experience Documents - MongoDB Atlas (PS015)")
                        .version("1.0.0")
                        .contact(new Contact().name("CareerLink Networks")));
    }
}
