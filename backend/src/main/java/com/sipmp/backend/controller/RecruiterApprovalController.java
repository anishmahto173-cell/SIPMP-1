package com.sipmp.backend.controller;

import com.sipmp.backend.entity.Company;
import com.sipmp.backend.entity.User;
import com.sipmp.backend.entity.UserAccessHistory;
import com.sipmp.backend.repository.CompanyRepository;
import com.sipmp.backend.repository.UserAccessHistoryRepository;
import com.sipmp.backend.repository.UserRepository;
import com.sipmp.backend.util.RoleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Recruiter Approval Controller restricted exclusively to authenticated Staff
 * with PLACEMENT_OFFICER designation.
 */
@RestController
@RequestMapping("/api/staff/recruiter-approvals")
@PreAuthorize("hasAuthority('ROLE_PLACEMENT_OFFICER')")
public class RecruiterApprovalController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserAccessHistoryRepository userAccessHistoryRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listRecruiters(
            @RequestParam(required = false, defaultValue = "Pending") String status
    ) {
        List<User> recruiters;
        if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
            recruiters = userRepository.findByRoleInOrderByCreatedAtDesc(RoleUtils.RECRUITER_ROLE_VALUES);
        } else {
            recruiters = userRepository.findByRoleInAndStatusIgnoreCaseOrderByCreatedAtDesc(
                    RoleUtils.RECRUITER_ROLE_VALUES,
                    status.trim()
            );
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (User recruiter : recruiters) {
            result.add(toRecruiterDto(recruiter));
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{userId}/approve")
    @Transactional
    public ResponseEntity<?> approveRecruiter(
            @PathVariable Long userId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication
    ) {
        Optional<User> recruiterOpt = userRepository.findById(userId);
        if (recruiterOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Recruiter account not found."
            ));
        }

        User recruiter = recruiterOpt.get();
        if (!RoleUtils.COMPANY_RECRUITER.equals(RoleUtils.normalizeRole(recruiter.getRole()))) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Target user is not a COMPANY_RECRUITER account."
            ));
        }

        if (!"Pending".equalsIgnoreCase(recruiter.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Recruiter account is already " + recruiter.getStatus() + "."
            ));
        }

        User officer = resolveActingOfficer(authentication);
        if (officer == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Authenticated Placement Officer record not found."
            ));
        }

        String oldStatus = recruiter.getStatus();
        recruiter.setStatus("Active");
        recruiter.setUpdatedAt(LocalDateTime.now());
        userRepository.save(recruiter);

        String reason = (body != null && body.get("reason") != null && !body.get("reason").trim().isEmpty())
                ? body.get("reason").trim()
                : "Company verified by Placement Officer";

        UserAccessHistory history = UserAccessHistory.builder()
                .userId(recruiter.getUserId())
                .actionType("APPROVE")
                .oldRole(recruiter.getRole())
                .newRole(recruiter.getRole())
                .oldStatus(oldStatus)
                .newStatus("Active")
                .reason(reason)
                .actionBy(officer.getUserId())
                .createdAt(LocalDateTime.now())
                .build();
        userAccessHistoryRepository.save(history);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Recruiter account approved and activated.",
                "recruiter", toRecruiterDto(recruiter)
        ));
    }

    @PostMapping("/{userId}/reject")
    @Transactional
    public ResponseEntity<?> rejectRecruiter(
            @PathVariable Long userId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication
    ) {
        String reason = body != null ? body.get("reason") : null;
        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "A rejection reason is required."
            ));
        }

        Optional<User> recruiterOpt = userRepository.findById(userId);
        if (recruiterOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Recruiter account not found."
            ));
        }

        User recruiter = recruiterOpt.get();
        if (!RoleUtils.COMPANY_RECRUITER.equals(RoleUtils.normalizeRole(recruiter.getRole()))) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Target user is not a COMPANY_RECRUITER account."
            ));
        }

        if (!"Pending".equalsIgnoreCase(recruiter.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Recruiter account is already " + recruiter.getStatus() + "."
            ));
        }

        User officer = resolveActingOfficer(authentication);
        if (officer == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Authenticated Placement Officer record not found."
            ));
        }

        String oldStatus = recruiter.getStatus();
        recruiter.setStatus("Rejected");
        recruiter.setUpdatedAt(LocalDateTime.now());
        userRepository.save(recruiter);

        UserAccessHistory history = UserAccessHistory.builder()
                .userId(recruiter.getUserId())
                .actionType("REJECT")
                .oldRole(recruiter.getRole())
                .newRole(recruiter.getRole())
                .oldStatus(oldStatus)
                .newStatus("Rejected")
                .reason(reason.trim())
                .actionBy(officer.getUserId())
                .createdAt(LocalDateTime.now())
                .build();
        userAccessHistoryRepository.save(history);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Recruiter registration rejected.",
                "recruiter", toRecruiterDto(recruiter)
        ));
    }

    private User resolveActingOfficer(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return userRepository.findByEmailIgnoreCase(authentication.getName()).orElse(null);
    }

    private Map<String, Object> toRecruiterDto(User recruiter) {
        Optional<Company> companyOpt = companyRepository.findByUserId(recruiter.getUserId());
        String companyName = companyOpt.map(Company::getCompanyName)
                .filter(name -> !name.isBlank())
                .orElseGet(() -> recruiter.getCompanyName() != null && !recruiter.getCompanyName().isBlank()
                        ? recruiter.getCompanyName()
                        : "Not specified");
        String companyWebsite = companyOpt.map(Company::getWebsite)
                .filter(w -> !w.isBlank())
                .orElse(recruiter.getCompanyWebsite());

        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("userId", recruiter.getUserId());
        dto.put("fullName", recruiter.getFullName());
        dto.put("email", recruiter.getEmail());
        dto.put("phone", recruiter.getPhone());
        dto.put("companyName", companyName);
        dto.put("companyWebsite", companyWebsite);
        dto.put("designation", recruiter.getDesignation());
        dto.put("status", recruiter.getStatus());
        dto.put("createdAt", recruiter.getCreatedAt());
        return dto;
    }
}
