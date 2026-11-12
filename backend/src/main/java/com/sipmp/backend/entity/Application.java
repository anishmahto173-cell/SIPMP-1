package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
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
    private Long applicationId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "opportunity_id", nullable = false)
    private Long opportunityId;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "Applied"; // Applied, Shortlisted, Interview Scheduled, Selected, Rejected, Withdrawn

    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
