package com.sipmp.backend.repository;

import com.sipmp.backend.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByApplicationId(Long applicationId);
    List<Offer> findByStatus(String status);
}
