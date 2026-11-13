package com.sipmp.backend.util;

import java.util.List;

/**
 * Normalizes role strings stored in MySQL (both Title Case from IA5 SQL
 * and UPPER_SNAKE_CASE from Spring Boot endpoints) into canonical role names.
 */
public final class RoleUtils {

    public static final String STUDENT = "STUDENT";
    public static final String COMPANY_RECRUITER = "COMPANY_RECRUITER";
    public static final String PLACEMENT_OFFICER = "PLACEMENT_OFFICER";
    public static final String FACULTY_COORDINATOR = "FACULTY_COORDINATOR";

    public static final List<String> RECRUITER_ROLE_VALUES = List.of(
            "COMPANY_RECRUITER",
            "Company Recruiter",
            "company_recruiter"
    );

    private RoleUtils() {
    }

    public static String normalizeRole(String rawRole) {
        if (rawRole == null) {
            return "";
        }
        String cleaned = rawRole.trim().toUpperCase().replace(' ', '_').replace('-', '_');
        return switch (cleaned) {
            case "STUDENT" -> STUDENT;
            case "COMPANY_RECRUITER", "RECRUITER" -> COMPANY_RECRUITER;
            case "PLACEMENT_OFFICER" -> PLACEMENT_OFFICER;
            case "FACULTY_COORDINATOR" -> FACULTY_COORDINATOR;
            default -> cleaned;
        };
    }

    public static boolean isStaffDesignation(String rawRole) {
        String normalized = normalizeRole(rawRole);
        return PLACEMENT_OFFICER.equals(normalized) || FACULTY_COORDINATOR.equals(normalized);
    }
}
