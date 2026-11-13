package com.sipmp.backend.repository;

import com.sipmp.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    List<Application> findByStudentId(Integer studentId);
    List<Application> findByOpportunityId(Integer opportunityId);
    List<Application> findByStatus(String status);
    Optional<Application> findByStudentIdAndOpportunityId(Integer studentId, Integer opportunityId);
    boolean existsByStudentIdAndOpportunityId(Integer studentId, Integer opportunityId);
}
