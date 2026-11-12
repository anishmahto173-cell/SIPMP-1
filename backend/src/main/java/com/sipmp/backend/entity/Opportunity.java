package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
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
    private Long opportunityId;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "job_type", nullable = false, length = 30)
    private String jobType; // Full-time, Internship

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "skills_required", columnDefinition = "TEXT")
    private String skillsRequired;

    @Column(name = "package_ctc", nullable = false)
    private Double packageCtc;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "deadline", nullable = false)
    private LocalDate deadline;

    @Column(name = "min_cgpa", nullable = false)
    private Double minCgpa;

    @Column(name = "eligible_branches", nullable = false, length = 255)
    private String eligibleBranches; // Comma separated: CSE,IT,ECE

    @Column(name = "eligible_semesters", nullable = false, length = 100)
    private String eligibleSemesters; // Comma separated: 5,6

    @Column(name = "max_backlogs", nullable = false)
    private Integer maxBacklogs = 0;

    @Column(name = "openings_count")
    private Integer openingsCount = 1;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "Open"; // Open, Closed, Archived, Deleted

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
