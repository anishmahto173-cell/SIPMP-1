package com.sipmp.backend.controller;

import com.sipmp.backend.entity.Opportunity;
import com.sipmp.backend.entity.User;
import com.sipmp.backend.repository.OpportunityRepository;
import com.sipmp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    @Autowired
    private OpportunityRepository opportunityRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Opportunity>> getAllOpportunities() {
        return ResponseEntity.ok(opportunityRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOpportunityById(@PathVariable Integer id) {
        Optional<Opportunity> opp = opportunityRepository.findById(id);
        if (opp.isPresent()) {
            return ResponseEntity.ok(opp.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOpportunity(@RequestBody Opportunity opportunity, Authentication authentication) {
        if (opportunity.getCompensation() == null || opportunity.getCompensation().compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Compensation must be greater than 0 (BR-06)."));
        }
        if (opportunity.getApplicationDeadline() != null && opportunity.getApplicationDeadline().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Application deadline must be a future date."));
        }
        if (opportunity.getPostedBy() == null && authentication != null) {
            userRepository.findByEmailIgnoreCase(authentication.getName())
                    .map(User::getUserId)
                    .ifPresent(opportunity::setPostedBy);
        }

        opportunity.setStatus("Open");
        opportunity.setCreatedAt(LocalDateTime.now());
        opportunity.setUpdatedAt(LocalDateTime.now());

        Opportunity saved = opportunityRepository.save(opportunity);
        return ResponseEntity.ok(Map.of("success", true, "message", "Opportunity published successfully.", "opportunity", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDeleteOpportunity(@PathVariable Integer id, @RequestParam(defaultValue = "Archived by user") String reason) {
        Optional<Opportunity> oppOpt = opportunityRepository.findById(id);
        if (oppOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Opportunity opp = oppOpt.get();
        opp.setStatus("Deleted");
        opp.setUpdatedAt(LocalDateTime.now());
        opportunityRepository.save(opp);

        return ResponseEntity.ok(Map.of("success", true, "message", "Opportunity soft-deleted successfully (BR-10)."));
    }
}
