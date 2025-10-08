package com.golive.repository;

import com.golive.domain.GoliveHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoliveHistoryRepository extends JpaRepository<GoliveHistory, Long> {
    List<GoliveHistory> findByChangeIdOrderByActionTimeAsc(Long changeId);
}


