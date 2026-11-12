package com.sipmp.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 6 / Spring Boot 3.5.7 Configuration.
 * Enforces role isolation for Student, Company Recruiter, and Staff personas.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/opportunities/**").permitAll()
                .requestMatchers("/api/student/**").hasAnyAuthority("ROLE_STUDENT", "ROLE_ADMINISTRATOR")
                .requestMatchers("/api/recruiter/**").hasAnyAuthority("ROLE_COMPANY_RECRUITER", "ROLE_ADMINISTRATOR")
                .requestMatchers("/api/officer/**").hasAnyAuthority("ROLE_PLACEMENT_OFFICER", "ROLE_FACULTY_COORDINATOR", "ROLE_ADMINISTRATOR")
                .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMINISTRATOR")
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
