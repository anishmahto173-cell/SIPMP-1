package com.sipmp.backend.controller;

import com.sipmp.backend.entity.User;
import com.sipmp.backend.entity.StudentProfile;
import com.sipmp.backend.entity.Company;
import com.sipmp.backend.repository.UserRepository;
import com.sipmp.backend.repository.StudentProfileRepository;
import com.sipmp.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * S01: Role-Segmented Login with 3 visible choices: STUDENT, RECRUITER, STAFF
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
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

        // Role verification matching the 3 visible options
        if ("STUDENT".equalsIgnoreCase(roleOption) && !"STUDENT".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Role mismatch: You selected Student, but this account is registered as " + user.getRole() + "."));
        }
        if ("RECRUITER".equalsIgnoreCase(roleOption) && !"COMPANY_RECRUITER".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Role mismatch: You selected Recruiter, but this account is registered as " + user.getRole() + "."));
        }
        if ("STAFF".equalsIgnoreCase(roleOption)) {
            List<String> staffRoles = Arrays.asList("PLACEMENT_OFFICER", "FACULTY_COORDINATOR", "ADMINISTRATOR");
            if (!staffRoles.contains(user.getRole().toUpperCase())) {
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

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful.");
        response.put("user", user);

        return ResponseEntity.ok(response);
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
                "user", newUser
        ));
    }
}
