package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
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
    private Long studentId;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "enrollment_no", nullable = false, unique = true, length = 30)
    private String enrollmentNo;

    @Column(name = "branch", nullable = false, length = 50)
    private String branch; // CSE, IT, ECE, ME, CE

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "cgpa", nullable = false)
    private Double cgpa;

    @Column(name = "backlogs", nullable = false)
    private Integer backlogs = 0;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "verification_status", nullable = false, length = 20)
    private String verificationStatus = "Pending"; // Pending, Verified, Rejected

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
