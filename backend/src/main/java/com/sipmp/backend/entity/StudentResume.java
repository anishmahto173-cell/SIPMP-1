package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity for Table: student_resumes (IA5 Schema, Table 5)
 */
@Entity
@Table(name = "student_resumes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_id")
    private Integer resumeId;

    @Column(name = "student_id", nullable = false)
    private Integer studentId;

    @Column(name = "file_name", nullable = false, length = 150)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 255)
    private String filePath;

    @Column(name = "file_type", nullable = false, length = 10)
    private String fileType;

    @Column(name = "file_size_kb", nullable = false)
    private Integer fileSizeKb;

    @Column(name = "is_current")
    @Builder.Default
    private Boolean isCurrent = true;

    @Column(name = "removal_reason", length = 255)
    private String removalReason;

    @Column(name = "removed_by")
    private Integer removedBy;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.isCurrent == null) {
            this.isCurrent = true;
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
