package com.sipmp.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
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
    private Integer userId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, unique = true, length = 15)
    private String phone;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "role", nullable = false, length = 30)
    private String role; // STUDENT, COMPANY_RECRUITER, PLACEMENT_OFFICER, FACULTY_COORDINATOR

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "Pending"; // Active, Pending, Deactivated, Rejected, Deleted

    @Column(name = "failed_attempts")
    @Builder.Default
    private Integer failedAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "employee_id", length = 50)
    private String employeeId;

    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "enrollment_no", unique = true, length = 30)
    private String enrollmentNo;

    @Column(name = "branch", length = 50)
    private String branch;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "company_website", length = 150)
    private String companyWebsite;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "scope_of_access", length = 255)
    private String scopeOfAccess;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (this.status == null) {
            this.status = "Pending";
        }
        if (this.failedAttempts == null) {
            this.failedAttempts = 0;
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
