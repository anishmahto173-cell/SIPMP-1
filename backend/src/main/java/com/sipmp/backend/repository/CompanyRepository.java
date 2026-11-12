package com.sipmp.backend.repository;

import com.sipmp.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByUserId(Long userId);
    Optional<Company> findByCompanyNameIgnoreCase(String companyName);
    boolean existsByCompanyNameIgnoreCase(String companyName);
}
