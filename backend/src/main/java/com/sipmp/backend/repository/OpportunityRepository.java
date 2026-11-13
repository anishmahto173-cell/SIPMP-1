package com.sipmp.backend.repository;

import com.sipmp.backend.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Integer> {
    List<Opportunity> findByCompanyId(Integer companyId);
    List<Opportunity> findByStatus(String status);
    List<Opportunity> findByType(String type);
}
