package com.sipmp.backend.repository;

import com.sipmp.backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Integer> {
    List<Interview> findByApplicationId(Integer applicationId);
    List<Interview> findByStatus(String status);
}
