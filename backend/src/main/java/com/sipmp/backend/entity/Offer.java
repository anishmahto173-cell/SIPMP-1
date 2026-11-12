package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity for Table: offers (IA5 Schema, Table 14)
 */
@Entity
@Table(name = "offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offer_id")
    private Long offerId;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "ctc_lpa", nullable = false)
    private Double ctcLpa;

    @Column(name = "designation", nullable = false, length = 100)
    private String designation;

    @Column(name = "joining_location", length = 100)
    private String joiningLocation;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "valid_until", nullable = false)
    private LocalDate validUntil;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "Pending"; // Pending, Accepted, Rejected, Expired

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
