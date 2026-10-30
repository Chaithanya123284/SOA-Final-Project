package com.careerlink.application.client;

import com.careerlink.application.dto.ProfileSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "profile-service")
public interface ProfileServiceClient {

    @GetMapping("/api/v1/profiles/{userId}")
    ProfileSummaryDto getProfileByUserId(@PathVariable("userId") Long userId);

    @GetMapping("/api/v1/profiles/exists/{userId}")
    Boolean profileExists(@PathVariable("userId") Long userId);
}
