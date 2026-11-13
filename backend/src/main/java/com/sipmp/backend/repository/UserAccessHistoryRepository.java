package com.sipmp.backend.repository;

import com.sipmp.backend.entity.UserAccessHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAccessHistoryRepository extends JpaRepository<UserAccessHistory, Long> {
    List<UserAccessHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
