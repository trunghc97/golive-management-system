package com.golive.repository;

import com.golive.domain.GoliveChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface GoliveChangeRepository extends JpaRepository<GoliveChange, Long> {

    @Query("""
      SELECT DISTINCT c FROM GoliveChange c
      JOIN c.components gc
      WHERE gc.component.id IN :componentIds
        AND (:excludeId IS NULL OR c.id <> :excludeId)
        AND ( (c.startTime <= :endTime AND c.endTime >= :startTime) )
    """)
    List<GoliveChange> findConflicts(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("componentIds") List<Long> componentIds,
        @Param("excludeId") Long excludeId
    );
}


