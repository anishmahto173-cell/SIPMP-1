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
    private Integer interviewId;

    @Column(name = "application_id", nullable = false)
    private Integer applicationId;

    @Column(name = "round_number")
    @Builder.Default
    private Integer roundNumber = 1;

    @Column(name = "interview_datetime", nullable = false)
    private LocalDateTime interviewDatetime;

    @Column(name = "mode", nullable = false, length = 10)
    private String mode; // Online, Offline

    @Column(name = "venue_or_link", length = 255)
    private String venueOrLink;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "Scheduled"; // Scheduled, Completed, Cancelled

    @Column(name = "result", length = 20)
    @Builder.Default
    private String result = "Pending"; // Pending, Passed, Failed

    @Column(name = "rescheduled_from")
    private LocalDateTime rescheduledFrom;

    @Column(name = "cancel_reason", length = 255)
    private String cancelReason;

    @Column(name = "scheduled_by", nullable = false)
    private Integer scheduledBy;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.roundNumber == null) {
            this.roundNumber = 1;
        }
        if (this.status == null) {
            this.status = "Scheduled";
        }
        if (this.result == null) {
            this.result = "Pending";
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
