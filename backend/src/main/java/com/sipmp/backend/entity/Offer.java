package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
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
    private Integer offerId;

    @Column(name = "application_id", nullable = false, unique = true)
    private Integer applicationId;

    @Column(name = "job_title", nullable = false, length = 150)
    private String jobTitle;

    @Column(name = "package_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal packageAmount;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "offer_validity_date", nullable = false)
    private LocalDate offerValidityDate;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "Pending"; // Pending, Accepted, Rejected, Expired, Revoked

    @Column(name = "remarks", length = 255)
    private String remarks;

    @Column(name = "released_by", nullable = false)
    private Integer releasedBy;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.status == null) {
            this.status = "Pending";
        }
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
