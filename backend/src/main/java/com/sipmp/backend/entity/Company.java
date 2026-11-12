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
    private Long companyId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "company_name", nullable = false, unique = true, length = 150)
    private String companyName;

    @Column(name = "industry", length = 100)
    private String industry;

    @Column(name = "website", length = 200)
    private String website;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "hr_name", nullable = false, length = 100)
    private String hrName;

    @Column(name = "hr_email", nullable = false, length = 120)
    private String hrEmail;

    @Column(name = "hr_phone", nullable = false, length = 15)
    private String hrPhone;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
