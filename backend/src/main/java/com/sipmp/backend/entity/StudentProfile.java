package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity for Table: student_profiles (IA5 Schema, Table 4)
 */
@Entity
@Table(name = "student_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Integer studentId;

    @Column(name = "user_id", nullable = false, unique = true)
    private Integer userId;

    @Column(name = "enrollment_no", nullable = false, unique = true, length = 30)
    private String enrollmentNo;

    @Column(name = "branch", nullable = false, length = 50)
    private String branch; // CSE, IT, ECE, ME, CE

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "cgpa", nullable = false, precision = 4, scale = 2)
    private BigDecimal cgpa;

    @Column(name = "backlogs")
    @Builder.Default
    private Integer backlogs = 0;

    @Column(name = "skills", length = 255)
    private String skills;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "linkedin_url", length = 150)
    private String linkedinUrl;

    @Column(name = "github_url", length = 150)
    private String githubUrl;

    @Column(name = "verification_status", length = 30)
    @Builder.Default
    private String verificationStatus = "Pending"; // Pending, Verified, Correction Requested

    @Column(name = "verification_remarks", length = 255)
    private String verificationRemarks;

    @Column(name = "verified_by")
    private Integer verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.backlogs == null) {
            this.backlogs = 0;
        }
        if (this.verificationStatus == null) {
            this.verificationStatus = "Pending";
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
