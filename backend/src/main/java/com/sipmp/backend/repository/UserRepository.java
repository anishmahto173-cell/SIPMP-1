package com.sipmp.backend.repository;

import com.sipmp.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByPhone(String phone);
    List<User> findByRole(String role);
    List<User> findByStatus(String status);
    List<User> findByRoleInAndStatusIgnoreCaseOrderByCreatedAtDesc(Collection<String> roles, String status);
    List<User> findByRoleInOrderByCreatedAtDesc(Collection<String> roles);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhone(String phone);
}
