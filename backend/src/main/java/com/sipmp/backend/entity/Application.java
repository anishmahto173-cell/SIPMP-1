package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity for Table: applications (IA5 Schema, Table 11)
 */
@Entity
@Table(name = "applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "opportunity_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Integer applicationId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "opportunity_id", nullable = false)
    private Integer opportunityId;

    @Column(name = "resume_id")
    private Integer resumeId;

    @Column(name = "applied_on", nullable = false, updatable = false)
    @Builder.Default
    private LocalDate appliedOn = LocalDate.now();

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "Applied"; // Applied, Shortlisted, Interview Scheduled, Selected, Rejected, Withdrawn

    @Column(name = "applied_by")
    private Integer appliedBy;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.appliedOn == null) {
            this.appliedOn = LocalDate.now();
        }
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.updatedAt == null) {
            this.updatedAt = now;
        }
        if (this.status == null) {
            this.status = "Applied";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
