package com.careerlink.profile.controller;

import com.careerlink.profile.dto.ProfileRequest;
import com.careerlink.profile.dto.ProfileResponse;
import com.careerlink.profile.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profiles")
@Tag(name = "Candidate Profiles", description = "Candidate profiles, resumes, skills, and recruiter talent discovery")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping
    @Operation(summary = "Create or update candidate profile")
    public ResponseEntity<ProfileResponse> createOrUpdateProfile(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createOrUpdateProfile(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get candidate profile by user ID")
    public ResponseEntity<?> getProfileByUserId(@PathVariable Long userId) {
        try {
            ProfileResponse response = profileService.getProfileByUserId(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/exists/{userId}")
    @Operation(summary = "Inter-service check: Verify if a candidate profile exists")
    public ResponseEntity<Boolean> profileExists(@PathVariable Long userId) {
        boolean exists = profileService.profileExists(userId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/candidates")
    @Operation(summary = "Get all candidate profiles for recruiter talent pool discovery")
    public ResponseEntity<List<ProfileResponse>> getAllCandidates() {
        List<ProfileResponse> candidates = profileService.getAllCandidates();
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/search")
    @Operation(summary = "Search candidate profiles by skills or headline keyword")
    public ResponseEntity<List<ProfileResponse>> searchProfiles(@RequestParam(required = false, defaultValue = "") String query) {
        List<ProfileResponse> results = profileService.searchProfiles(query);
        return ResponseEntity.ok(results);
    }
}
