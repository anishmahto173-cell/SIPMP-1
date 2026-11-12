package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
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
    private Long reportId;

    @Column(name = "report_name", nullable = false, length = 150)
    private String reportName;

    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType;

    @Column(name = "parameters", columnDefinition = "TEXT")
    private String parameters;

    @Column(name = "generated_by", nullable = false)
    private Long generatedBy;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "generated_at", nullable = false, updatable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();
}
