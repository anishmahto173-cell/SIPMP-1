package com.sipmp.backend.repository;

import com.sipmp.backend.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByEnrollmentNoIgnoreCase(String enrollmentNo);
    List<StudentProfile> findByBranch(String branch);
    List<StudentProfile> findByVerificationStatus(String status);
    boolean existsByEnrollmentNoIgnoreCase(String enrollmentNo);
}
