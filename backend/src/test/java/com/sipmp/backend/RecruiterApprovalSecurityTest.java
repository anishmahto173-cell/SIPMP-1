package com.sipmp.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sipmp.backend.entity.User;
import com.sipmp.backend.entity.UserAccessHistory;
import com.sipmp.backend.repository.UserAccessHistoryRepository;
import com.sipmp.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RecruiterApprovalSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAccessHistoryRepository userAccessHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private User placementOfficer;
    private User facultyCoordinator;
    private User student;
    private User activeRecruiter;
    private User pendingRecruiter;

    @BeforeEach
    void setUp() {
        userAccessHistoryRepository.deleteAll();
        userRepository.deleteAll();

        placementOfficer = userRepository.save(User.builder()
                .fullName("Neha Patel")
                .email("neha.patel@college.edu")
                .phone("9876500005")
                .passwordHash(passwordEncoder.encode("Neha@123"))
                .role("PLACEMENT_OFFICER")
                .status("Active")
                .failedAttempts(0)
                .department("Training and Placement Cell")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        facultyCoordinator = userRepository.save(User.builder()
                .fullName("Dr. Amit Verma")
                .email("amit.verma@college.edu")
                .phone("9876500006")
                .passwordHash(passwordEncoder.encode("Amit@123"))
                .role("FACULTY_COORDINATOR")
                .status("Active")
                .failedAttempts(0)
                .department("CSE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        student = userRepository.save(User.builder()
                .fullName("Priya Shah")
                .email("priya.shah@college.edu")
                .phone("9876500002")
                .passwordHash(passwordEncoder.encode("Priya@123"))
                .role("STUDENT")
                .status("Active")
                .failedAttempts(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        activeRecruiter = userRepository.save(User.builder()
                .fullName("Karan Joshi")
                .email("karan.joshi@technova.com")
                .phone("9876500004")
                .passwordHash(passwordEncoder.encode("Karan@123"))
                .role("COMPANY_RECRUITER")
                .status("Active")
                .failedAttempts(0)
                .companyName("TechNova Solutions")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        pendingRecruiter = userRepository.save(User.builder()
                .fullName("Vikram Rao")
                .email("vikram.rao@quickhire.com")
                .phone("9876500008")
                .passwordHash(passwordEncoder.encode("Vikram@123"))
                .role("COMPANY_RECRUITER")
                .status("Pending")
                .failedAttempts(0)
                .companyName("QuickHire Pvt Ltd")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());
    }

    private MockHttpSession loginAndGetSession(String roleOption, String identifier, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "roleOption", roleOption,
                                "identifier", identifier,
                                "password", password
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn();

        return (MockHttpSession) result.getRequest().getSession(false);
    }

    @Test
    void unauthenticatedRequestsReceive401() throws Exception {
        mockMvc.perform(get("/api/staff/recruiter-approvals"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/staff/recruiter-approvals/" + pendingRecruiter.getUserId() + "/approve")
                        .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void stateChangingRequestsWithoutCsrfReceive403() throws Exception {
        MockHttpSession poSession = loginAndGetSession("STAFF", placementOfficer.getEmail(), "Neha@123");

        mockMvc.perform(post("/api/staff/recruiter-approvals/" + pendingRecruiter.getUserId() + "/approve")
                        .session(poSession))
                .andExpect(status().isForbidden());
    }

    @Test
    void placementOfficerCanListApproveAndAuditPendingRecruiter() throws Exception {
        MockHttpSession poSession = loginAndGetSession("STAFF", placementOfficer.getEmail(), "Neha@123");

        mockMvc.perform(get("/api/auth/me").session(poSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.role").value("PLACEMENT_OFFICER"));

        mockMvc.perform(get("/api/staff/recruiter-approvals").session(poSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("vikram.rao@quickhire.com"))
                .andExpect(jsonPath("$[0].companyName").value("QuickHire Pvt Ltd"))
                .andExpect(jsonPath("$[0].status").value("Pending"));

        mockMvc.perform(post("/api/staff/recruiter-approvals/" + pendingRecruiter.getUserId() + "/approve")
                        .session(poSession)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.recruiter.status").value("Active"));

        User updated = userRepository.findById(pendingRecruiter.getUserId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo("Active");

        List<UserAccessHistory> history = userAccessHistoryRepository.findByUserIdOrderByCreatedAtDesc(pendingRecruiter.getUserId());
        assertThat(history).hasSize(1);
        assertThat(history.get(0).getActionType()).isEqualTo("APPROVE");
        assertThat(history.get(0).getNewStatus()).isEqualTo("Active");
        assertThat(history.get(0).getActionBy()).isEqualTo(placementOfficer.getUserId());
    }

    @Test
    void placementOfficerCanRejectPendingRecruiterWithReason() throws Exception {
        MockHttpSession poSession = loginAndGetSession("STAFF", placementOfficer.getEmail(), "Neha@123");

        mockMvc.perform(post("/api/staff/recruiter-approvals/" + pendingRecruiter.getUserId() + "/reject")
                        .session(poSession)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("reason", "Company registration could not be verified"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.recruiter.status").value("Rejected"));

        User updated = userRepository.findById(pendingRecruiter.getUserId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo("Rejected");

        List<UserAccessHistory> history = userAccessHistoryRepository.findByUserIdOrderByCreatedAtDesc(pendingRecruiter.getUserId());
        assertThat(history).hasSize(1);
        assertThat(history.get(0).getActionType()).isEqualTo("REJECT");
        assertThat(history.get(0).getReason()).isEqualTo("Company registration could not be verified");
    }

    @Test
    void facultyCoordinatorReceives403ForRecruiterApprovalApis() throws Exception {
        MockHttpSession fcSession = loginAndGetSession("STAFF", facultyCoordinator.getEmail(), "Amit@123");

        mockMvc.perform(get("/api/auth/me").session(fcSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.role").value("FACULTY_COORDINATOR"));

        mockMvc.perform(get("/api/staff/recruiter-approvals").session(fcSession))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/staff/recruiter-approvals/" + pendingRecruiter.getUserId() + "/approve")
                        .session(fcSession)
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    void studentAndRecruiterReceive403ForRecruiterApprovalApis() throws Exception {
        MockHttpSession studentSession = loginAndGetSession("STUDENT", student.getEmail(), "Priya@123");
        mockMvc.perform(get("/api/staff/recruiter-approvals").session(studentSession))
                .andExpect(status().isForbidden());

        MockHttpSession recruiterSession = loginAndGetSession("RECRUITER", activeRecruiter.getEmail(), "Karan@123");
        mockMvc.perform(get("/api/staff/recruiter-approvals").session(recruiterSession))
                .andExpect(status().isForbidden());
    }

    @Test
    void logoutInvalidatesSession() throws Exception {
        MockHttpSession poSession = loginAndGetSession("STAFF", placementOfficer.getEmail(), "Neha@123");

        mockMvc.perform(post("/api/auth/logout")
                        .session(poSession)
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(poSession.isInvalid()).isTrue();
    }
}
