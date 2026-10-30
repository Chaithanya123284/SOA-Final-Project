package com.careerlink.profile.service;

import com.careerlink.profile.dto.ProfileRequest;
import com.careerlink.profile.dto.ProfileResponse;
import com.careerlink.profile.entity.CandidateProfile;
import com.careerlink.profile.repository.CandidateProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private CandidateProfileRepository profileRepository;

    @Transactional
    public ProfileResponse createOrUpdateProfile(ProfileRequest request) {
        Optional<CandidateProfile> existingOpt = profileRepository.findByUserId(request.getUserId());

        CandidateProfile profile = existingOpt.orElseGet(() -> CandidateProfile.builder()
                .userId(request.getUserId())
                .build());

        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setLocation(request.getLocation());
        profile.setHeadline(request.getHeadline());
        profile.setSummary(request.getSummary());
        profile.setSkills(request.getSkills() != null ? request.getSkills() : profile.getSkills());
        profile.setResumeUrl(request.getResumeUrl());
        profile.setResumeText(request.getResumeText());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setYearsOfExperience(request.getYearsOfExperience());
        profile.setCurrentCompany(request.getCurrentCompany());
        profile.setCurrentDesignation(request.getCurrentDesignation());

        if (request.getExperiences() != null) {
            profile.getExperiences().clear();
            profile.getExperiences().addAll(request.getExperiences());
        }

        if (request.getEducations() != null) {
            profile.getEducations().clear();
            profile.getEducations().addAll(request.getEducations());
        }

        CandidateProfile saved = profileRepository.save(profile);
        return mapToResponse(saved);
    }

    public ProfileResponse getProfileByUserId(Long userId) {
        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate profile not found for user ID: " + userId));
        return mapToResponse(profile);
    }

    public boolean profileExists(Long userId) {
        return profileRepository.existsByUserId(userId);
    }

    public List<ProfileResponse> getAllCandidates() {
        return profileRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProfileResponse> searchProfiles(String query) {
        return profileRepository.searchProfiles(query).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProfileResponse mapToResponse(CandidateProfile p) {
        return ProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUserId())
                .fullName(p.getFullName())
                .email(p.getEmail())
                .phone(p.getPhone())
                .location(p.getLocation())
                .headline(p.getHeadline())
                .summary(p.getSummary())
                .skills(p.getSkills())
                .experiences(p.getExperiences())
                .educations(p.getEducations())
                .resumeUrl(p.getResumeUrl())
                .resumeText(p.getResumeText())
                .githubUrl(p.getGithubUrl())
                .linkedinUrl(p.getLinkedinUrl())
                .portfolioUrl(p.getPortfolioUrl())
                .yearsOfExperience(p.getYearsOfExperience())
                .currentCompany(p.getCurrentCompany())
                .currentDesignation(p.getCurrentDesignation())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
