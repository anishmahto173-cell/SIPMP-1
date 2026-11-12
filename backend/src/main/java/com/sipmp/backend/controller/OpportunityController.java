package com.sipmp.backend.controller;

import com.sipmp.backend.entity.Opportunity;
import com.sipmp.backend.repository.OpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/opportunities")
@CrossOrigin(origins = "*")
public class OpportunityController {

    @Autowired
    private OpportunityRepository opportunityRepository;

    @GetMapping
    public ResponseEntity<List<Opportunity>> getAllOpportunities() {
        return ResponseEntity.ok(opportunityRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOpportunityById(@PathVariable Long id) {
        Optional<Opportunity> opp = opportunityRepository.findById(id);
        if (opp.isPresent()) {
            return ResponseEntity.ok(opp.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOpportunity(@RequestBody Opportunity opportunity) {
        if (opportunity.getPackageCtc() == null || opportunity.getPackageCtc() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Package (CTC) must be greater than 0 (BR-06)."));
        }
        if (opportunity.getDeadline() != null && opportunity.getDeadline().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Application deadline must be a future date."));
        }

        opportunity.setStatus("Open");
        opportunity.setCreatedAt(LocalDateTime.now());
        opportunity.setUpdatedAt(LocalDateTime.now());

        Opportunity saved = opportunityRepository.save(opportunity);
        return ResponseEntity.ok(Map.of("success", true, "message", "Opportunity published successfully.", "opportunity", saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> softDeleteOpportunity(@PathVariable Long id, @RequestParam(defaultValue = "Archived by user") String reason) {
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
