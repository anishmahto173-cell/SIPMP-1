package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity for Table: companies (IA5 Schema, Table 7)
 */
@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Integer companyId;

    @Column(name = "user_id", nullable = false, unique = true)
    private Integer userId;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "industry", length = 100)
    private String industry;

    @Column(name = "website", length = 150)
    private String website;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "hr_name", length = 100)
    private String hrName;

    @Column(name = "hr_email", length = 100)
    private String hrEmail;

    @Column(name = "hr_phone", length = 15)
    private String hrPhone;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "company_size", length = 30)
    private String companySize;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
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
