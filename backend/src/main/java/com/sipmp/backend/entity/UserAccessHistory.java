package com.sipmp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity for Table: user_access_history (IA5 Schema, Table 3)
 */
@Entity
@Table(name = "user_access_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccessHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "action_type", nullable = false, length = 30)
    private String actionType; // APPROVE, REJECT, ACTIVATE, DEACTIVATE, ROLE_CHANGE

    @Column(name = "old_role", length = 30)
    private String oldRole;

    @Column(name = "new_role", length = 30)
    private String newRole;

    @Column(name = "old_status", length = 20)
    private String oldStatus;

    @Column(name = "new_status", length = 20)
    private String newStatus;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "action_by", nullable = false)
    private Long actionBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
