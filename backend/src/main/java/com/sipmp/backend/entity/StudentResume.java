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
    private Long resumeId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_size", nullable = false)
    private Long fileSize; // Max 2MB = 2097152 bytes

    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;

    @Column(name = "version", nullable = false)
    private Integer version = 1;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
