package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity for Table: interviews (IA5 Schema, Table 13)
 */
@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interview_id")
    private Long interviewId;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "round_name", nullable = false, length = 100)
    private String roundName;

    @Column(name = "interview_date", nullable = false)
    private LocalDateTime interviewDate;

    @Column(name = "interviewer_name", length = 100)
    private String interviewerName;

    @Column(name = "venue_or_link", length = 255)
    private String venueOrLink;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "Scheduled"; // Scheduled, Completed, Cancelled

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
