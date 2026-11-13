package com.sipmp.backend.controller;

import com.sipmp.backend.entity.Company;
import com.sipmp.backend.entity.StudentProfile;
import com.sipmp.backend.entity.User;
import com.sipmp.backend.repository.CompanyRepository;
import com.sipmp.backend.repository.StudentProfileRepository;
import com.sipmp.backend.repository.UserRepository;
import com.sipmp.backend.util.RoleUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityContextRepository securityContextRepository;

    @GetMapping("/csrf")
    public ResponseEntity<Map<String, String>> csrf(CsrfToken csrfToken) {
        return ResponseEntity.ok(Map.of(
                "token", csrfToken.getToken(),
                "headerName", csrfToken.getHeaderName()
        ));
    }

    /**
     * S01: Role-Segmented Login with 3 visible choices: STUDENT, RECRUITER, STAFF
     * Establishes a standard Spring Security HttpSession (JSESSIONID).
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        String roleOption = request.get("roleOption"); // STUDENT, RECRUITER, STAFF
        String identifier = request.get("identifier"); // Email or Phone
        String password = request.get("password");

        if (roleOption == null || identifier == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Missing required login fields."));
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(identifier.trim());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(identifier.trim());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid credentials. Please verify your email or phone and password."));
        }

        User user = userOpt.get();

        // Check account lock
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(LocalDateTime.now())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Your account is temporarily locked because of repeated failed attempts. Please try again later."));
        }

        // Account status checks
        if ("Pending".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Your account is pending approval by the Training & Placement Cell."));
        }
        if ("Deactivated".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Your account has been deactivated. Please contact the Administrator."));
        }
        if ("Rejected".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Your registration was rejected. Account details could not be verified."));
        }
        if ("Deleted".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Account not found or deleted."));
        }

        // Derive canonical role strictly from the database record
        String normalizedRole = RoleUtils.normalizeRole(user.getRole());

        // Role verification matching the 3 visible options
        if ("STUDENT".equalsIgnoreCase(roleOption) && !RoleUtils.STUDENT.equals(normalizedRole)) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Role mismatch: You selected Student, but this account is registered as " + user.getRole() + "."));
        }
        if ("RECRUITER".equalsIgnoreCase(roleOption) && !RoleUtils.COMPANY_RECRUITER.equals(normalizedRole)) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Role mismatch: You selected Recruiter, but this account is registered as " + user.getRole() + "."));
        }
        if ("STAFF".equalsIgnoreCase(roleOption)) {
            if (!RoleUtils.isStaffDesignation(user.getRole())) {
                return ResponseEntity.status(400).body(Map.of("success", false, "message", "Role mismatch: You selected Staff, but this account is registered as " + user.getRole() + "."));
            }
        }

        // Validate password
        boolean matches = passwordEncoder.matches(password, user.getPasswordHash()) || user.getPasswordHash().equals(password);
        if (!matches) {
            user.setFailedAttempts(user.getFailedAttempts() + 1);
            if (user.getFailedAttempts() >= 5) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(15));
                userRepository.save(user);
                return ResponseEntity.status(403).body(Map.of("success", false, "message", "Account locked due to 5 consecutive failed login attempts. Try again in 15 minutes."));
            }
            userRepository.save(user);
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid credentials. Please verify your email or phone and password."));
        }

        // Reset failed attempts on success
        user.setFailedAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        // Establish Spring Security HttpSession context using the database-derived authority
        httpRequest.getSession(true);
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + normalizedRole));
        UsernamePasswordAuthenticationToken authentication = UsernamePasswordAuthenticationToken.authenticated(
                user.getEmail(),
                null,
                authorities
        );
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
        securityContextRepository.saveContext(securityContext, httpRequest, httpResponse);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful.");
        response.put("user", toUserPayload(user, normalizedRole));

        return ResponseEntity.ok(response);
    }

    /**
     * Returns the currently authenticated user from the active Spring Security HttpSession.
     */
    @GetMapping("/me")
    public ResponseEntity<?> currentSession(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Not authenticated."));
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(authentication.getName());
        if (userOpt.isEmpty() || !"Active".equalsIgnoreCase(userOpt.get().getStatus())) {
            SecurityContextHolder.clearContext();
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Session is no longer valid."));
        }

        User user = userOpt.get();
        String normalizedRole = RoleUtils.normalizeRole(user.getRole());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "user", toUserPayload(user, normalizedRole)
        ));
    }

    /**
     * Invalidates the HttpSession, clears SecurityContextHolder, and expires JSESSIONID.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        Cookie cookie = new Cookie("JSESSIONID", "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        httpResponse.addCookie(cookie);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Logged out successfully."
        ));
    }

    /**
     * S02: Registration with Dynamic Fields per Role
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
        String fullName = (String) request.get("fullName");
        String email = (String) request.get("email");
        String phone = (String) request.get("phone");
        String password = (String) request.get("password");
        String role = (String) request.get("role"); // STUDENT, COMPANY_RECRUITER, PLACEMENT_OFFICER, FACULTY_COORDINATOR

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "This e-mail is already registered."));
        }
        if (userRepository.existsByPhone(phone)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "This phone number is already registered."));
        }

        String initialStatus = "STUDENT".equalsIgnoreCase(role) ? "Active" : "Pending"; // BR-03

        User newUser = User.builder()
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .status(initialStatus)
                .failedAttempts(0)
                .address((String) request.get("address"))
                .designation((String) request.get("designation"))
                .department((String) request.get("department"))
                .companyName((String) request.get("companyName"))
                .companyWebsite((String) request.get("companyWebsite"))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        newUser = userRepository.save(newUser);

        // If student, create student profile
        if ("STUDENT".equalsIgnoreCase(role)) {
            StudentProfile profile = StudentProfile.builder()
                    .userId(newUser.getUserId())
                    .enrollmentNo((String) request.getOrDefault("enrollmentNo", "DCSE-" + System.currentTimeMillis() % 10000))
                    .branch((String) request.getOrDefault("branch", "CSE"))
                    .semester((Integer) request.getOrDefault("semester", 5))
                    .cgpa(8.0)
                    .backlogs(0)
                    .skills("Java, Spring Boot, MySQL")
                    .address(newUser.getAddress())
                    .verificationStatus("Pending")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            studentProfileRepository.save(profile);
        }

        // If recruiter, create company profile
        if ("COMPANY_RECRUITER".equalsIgnoreCase(role) && request.containsKey("companyName")) {
            Company company = Company.builder()
                    .userId(newUser.getUserId())
                    .companyName((String) request.get("companyName"))
                    .industry("Information Technology")
                    .website((String) request.get("companyWebsite"))
                    .location("Bengaluru")
                    .hrName(newUser.getFullName())
                    .hrEmail(newUser.getEmail())
                    .hrPhone(newUser.getPhone())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            companyRepository.save(company);
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", initialStatus.equals("Active")
                        ? "Account registered successfully! You can now log in."
                        : "Registration submitted successfully! Your account is pending T&P approval.",
                "user", toUserPayload(newUser, RoleUtils.normalizeRole(newUser.getRole()))
        ));
    }

    private Map<String, Object> toUserPayload(User user, String normalizedRole) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("userId", user.getUserId());
        payload.put("fullName", user.getFullName());
        payload.put("email", user.getEmail());
        payload.put("phone", user.getPhone());
        payload.put("role", normalizedRole);
        payload.put("status", user.getStatus());
        payload.put("failedAttempts", user.getFailedAttempts());
        payload.put("lockedUntil", user.getLockedUntil());
        payload.put("address", user.getAddress());
        payload.put("designation", user.getDesignation());
        payload.put("department", user.getDepartment());
        payload.put("companyName", user.getCompanyName());
        payload.put("companyWebsite", user.getCompanyWebsite());
        payload.put("createdAt", user.getCreatedAt());
        payload.put("updatedAt", user.getUpdatedAt());
        return payload;
    }
}
