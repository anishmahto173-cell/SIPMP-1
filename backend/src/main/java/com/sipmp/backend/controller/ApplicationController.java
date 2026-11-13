package com.sipmp.backend.controller;

import com.sipmp.backend.entity.Application;
import com.sipmp.backend.entity.Offer;
import com.sipmp.backend.repository.ApplicationRepository;
import com.sipmp.backend.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private OfferRepository offerRepository;

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getByStudent(@PathVariable Integer studentId) {
        return ResponseEntity.ok(applicationRepository.findByStudentId(studentId));
    }

    @GetMapping("/opportunity/{opportunityId}")
    public ResponseEntity<List<Application>> getByOpportunity(@PathVariable Integer opportunityId) {
        return ResponseEntity.ok(applicationRepository.findByOpportunityId(opportunityId));
    }

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Integer> payload) {
        Integer studentId = payload.get("studentId");
        Integer opportunityId = payload.get("opportunityId");

        // BR-04: Prevent duplicate applications
        if (applicationRepository.existsByStudentIdAndOpportunityId(studentId, opportunityId)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Duplicate Application: You have already applied for this opening."
            ));
        }

        Application application = Application.builder()
                .studentId(studentId)
                .opportunityId(opportunityId)
                .status("Applied")
                .appliedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Application saved = applicationRepository.save(application);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Application submitted successfully! Your resume has been forwarded to the recruiter.",
                "application", saved
        ));
    }

    @PostMapping("/withdraw/{applicationId}")
    public ResponseEntity<?> withdraw(@PathVariable Integer applicationId, @RequestBody Map<String, String> body) {
        Optional<Application> appOpt = applicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Application app = appOpt.get();
        // BR-07: Cannot withdraw if already shortlisted in active rounds or selected
        if ("Interview Scheduled".equalsIgnoreCase(app.getStatus()) || "Selected".equalsIgnoreCase(app.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Cannot withdraw: Application is in advanced interview / offer stage. Please contact T&P Cell."
            ));
        }

        app.setStatus("Withdrawn");
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Application withdrawn successfully (BR-07)."
        ));
    }

    @PostMapping("/status/{applicationId}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer applicationId, @RequestBody Map<String, String> body) {
        Optional<Application> appOpt = applicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = body.get("status");
        Application app = appOpt.get();
        app.setStatus(newStatus);
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Candidate status updated to " + newStatus + "."
        ));
    }
}
