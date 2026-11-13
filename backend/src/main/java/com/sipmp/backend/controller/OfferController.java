package com.sipmp.backend.controller;

import com.sipmp.backend.entity.Offer;
import com.sipmp.backend.entity.Application;
import com.sipmp.backend.repository.OfferRepository;
import com.sipmp.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping
    public ResponseEntity<List<Offer>> getAllOffers() {
        return ResponseEntity.ok(offerRepository.findAll());
    }

    @PostMapping("/issue")
    public ResponseEntity<?> issueOffer(@RequestBody Offer offer) {
        if (offer.getCtcLpa() == null || offer.getCtcLpa() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Offered Package must be greater than 0 (BR-06)."));
        }

        offer.setStatus("Pending");
        offer.setCreatedAt(LocalDateTime.now());
        offer.setUpdatedAt(LocalDateTime.now());

        Offer saved = offerRepository.save(offer);

        // Update application status to Selected
        Optional<Application> appOpt = applicationRepository.findById(offer.getApplicationId());
        appOpt.ifPresent(app -> {
            app.setStatus("Selected");
            applicationRepository.save(app);
        });

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Offer letter generated and dispatched to student portal.",
                "offer", saved
        ));
    }

    /**
     * Responding to an offer: Accepted or Rejected (Enforcing BR-09 Single Offer Policy)
     */
    @PostMapping("/respond/{offerId}")
    public ResponseEntity<?> respondToOffer(@PathVariable Long offerId, @RequestBody Map<String, String> body) {
        Optional<Offer> offerOpt = offerRepository.findById(offerId);
        if (offerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Offer offer = offerOpt.get();
        String responseStatus = body.get("status"); // "Accepted" or "Rejected"

        if ("Accepted".equalsIgnoreCase(responseStatus)) {
            offer.setStatus("Accepted");
            offer.setUpdatedAt(LocalDateTime.now());
            offerRepository.save(offer);

            // BR-09: Single Offer Policy - Find target student and withdraw all other active applications
            Optional<Application> currentApp = applicationRepository.findById(offer.getApplicationId());
            if (currentApp.isPresent()) {
                Long studentId = currentApp.get().getStudentId();
                List<Application> otherApps = applicationRepository.findByStudentId(studentId);

                for (Application app : otherApps) {
                    if (!app.getApplicationId().equals(offer.getApplicationId()) &&
                        !"Rejected".equalsIgnoreCase(app.getStatus()) &&
                        !"Withdrawn".equalsIgnoreCase(app.getStatus())) {
                        app.setStatus("Withdrawn");
                        app.setUpdatedAt(LocalDateTime.now());
                        applicationRepository.save(app);
                    }
                }
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Congratulations! Placement offer accepted. Per Single Offer Policy (BR-09), remaining applications have been withdrawn."
            ));
        } else {
            offer.setStatus("Rejected");
            offer.setUpdatedAt(LocalDateTime.now());
            offerRepository.save(offer);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Offer declined."
            ));
        }
    }
}
