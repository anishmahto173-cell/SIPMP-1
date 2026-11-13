package com.sipmp.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity for Table: users (IA5 Schema, Table 1)
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "phone", nullable = false, unique = true, length = 15)
    private String phone;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "role", nullable = false, length = 30)
    private String role; // STUDENT, COMPANY_RECRUITER, PLACEMENT_OFFICER, FACULTY_COORDINATOR

    @Column(name = "status", nullable = false, length = 20)
    private String status; // Active, Pending, Deactivated, Rejected, Deleted

    @Column(name = "failed_attempts", nullable = false)
    private Integer failedAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "company_website", length = 150)
    private String companyWebsite;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
