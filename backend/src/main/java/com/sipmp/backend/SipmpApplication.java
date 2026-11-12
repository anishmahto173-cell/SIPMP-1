package com.sipmp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application Entry Point for SIPMP.
 * Student Internship & Placement Management Portal.
 */
@SpringBootApplication
public class SipmpApplication {

    public static void main(String[] args) {
        SpringApplication.run(SipmpApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" SIPMP Spring Boot Backend started on port 8080");
        System.out.println(" Target Database: MySQL 8 (placement_portal)");
        System.out.println(" Hibernate DDL: validate (Preserving 16 Tables)");
        System.out.println("==================================================");
    }
}
