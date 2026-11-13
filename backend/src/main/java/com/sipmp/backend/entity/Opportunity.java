package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity for Table: opportunities (IA5 Schema, Table 8)
 */
@Entity
@Table(name = "opportunities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "opportunity_id")
    private Integer opportunityId;

    @Column(name = "company_id", nullable = false)
    private Integer companyId;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "type", nullable = false, length = 20)
    private String type; // Internship, Placement

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "min_cgpa", precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal minCgpa = new BigDecimal("0.00");

    @Column(name = "eligible_branches", length = 100)
    private String eligibleBranches; // Comma separated: CSE,IT

    @Column(name = "min_semester")
    @Builder.Default
    private Integer minSemester = 1;

    @Column(name = "max_backlogs")
    @Builder.Default
    private Integer maxBacklogs = 0;

    @Column(name = "compensation", precision = 10, scale = 2)
    private BigDecimal compensation;

    @Column(name = "vacancies")
    @Builder.Default
    private Integer vacancies = 1;

    @Column(name = "application_deadline", nullable = false)
    private LocalDate applicationDeadline;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "Open"; // Open, Closed, Deleted

    @Column(name = "posted_by", nullable = false)
    private Integer postedBy;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.minCgpa == null) {
            this.minCgpa = new BigDecimal("0.00");
        }
        if (this.minSemester == null) {
            this.minSemester = 1;
        }
        if (this.maxBacklogs == null) {
            this.maxBacklogs = 0;
        }
        if (this.vacancies == null) {
            this.vacancies = 1;
        }
        if (this.status == null) {
            this.status = "Open";
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
