package com.careerlink.profile.repository;

import com.careerlink.profile.entity.CandidateProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends MongoRepository<CandidateProfile, String> {
    Optional<CandidateProfile> findByUserId(Long userId);
    Optional<CandidateProfile> findByEmail(String email);
    boolean existsByUserId(Long userId);

    @Query("{'$or': [{'headline': {$regex: ?0, $options: 'i'}}, {'summary': {$regex: ?0, $options: 'i'}}, {'skills': {$regex: ?0, $options: 'i'}}]}")
    List<CandidateProfile> searchProfiles(String query);
}
