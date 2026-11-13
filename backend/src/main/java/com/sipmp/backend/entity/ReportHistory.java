package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity for Table: report_history (IA5 Schema, Table 16)
 */
@Entity
@Table(name = "report_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @Column(name = "report_type", nullable = false, length = 100)
    private String reportType;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "scope", length = 100)
    private String scope;

    @Column(name = "export_format", length = 20)
    private String exportFormat;

    @Column(name = "generated_by", nullable = false)
    private Integer generatedBy;

    @Column(name = "generated_at", updatable = false)
    @Builder.Default
    private LocalDateTime generatedAt = LocalDateTime.now();

    @Column(name = "schedule_frequency", length = 50)
    private String scheduleFrequency;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.generatedAt == null) {
            this.generatedAt = now;
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
