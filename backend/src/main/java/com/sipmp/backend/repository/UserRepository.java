package com.sipmp.backend.repository;

import com.sipmp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByPhone(String phone);
    List<User> findByRole(String role);
    List<User> findByStatus(String status);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhone(String phone);
}
