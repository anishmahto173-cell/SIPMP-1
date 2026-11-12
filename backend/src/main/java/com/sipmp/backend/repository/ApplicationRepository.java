package com.sipmp.backend.repository;

import com.sipmp.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByOpportunityId(Long opportunityId);
    List<Application> findByStatus(String status);
    Optional<Application> findByStudentIdAndOpportunityId(Long studentId, Long opportunityId);
    boolean existsByStudentIdAndOpportunityId(Long studentId, Long opportunityId);
}
