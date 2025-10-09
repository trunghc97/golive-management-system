package com.golive.repository;

import com.golive.domain.GoliveChange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
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

    List<GoliveChange> findAllByGoliveDateBetween(LocalDate start, LocalDate end);

    @Query(value = """
      SELECT c.* FROM golive_change c
      WHERE (:status IS NULL OR c.status = :status)
        AND (
          :searchPattern IS NULL OR
          LOWER(c.change_id) LIKE CAST(:searchPattern AS text) OR
          LOWER(c.team_name) LIKE CAST(:searchPattern AS text) OR
          LOWER(c.registered_by) LIKE CAST(:searchPattern AS text)
        )
      ORDER BY c.start_time DESC
    """,
    countQuery = """
      SELECT COUNT(*) FROM golive_change c
      WHERE (:status IS NULL OR c.status = :status)
        AND (
          :searchPattern IS NULL OR
          LOWER(c.change_id) LIKE CAST(:searchPattern AS text) OR
          LOWER(c.team_name) LIKE CAST(:searchPattern AS text) OR
          LOWER(c.registered_by) LIKE CAST(:searchPattern AS text)
        )
    """,
    nativeQuery = true)
    Page<GoliveChange> searchChanges(
        @Param("searchPattern") String searchPattern,
        @Param("status") String status,
        Pageable pageable
    );

    Page<GoliveChange> findAllByOrderByStartTimeDesc(Pageable pageable);

    @Query("""
      SELECT c FROM GoliveChange c
      WHERE (:status IS NULL OR c.status = :status)
      ORDER BY c.startTime DESC
    """)
    Page<GoliveChange> findAllByStatusOrderByStartTimeDesc(
        @Param("status") com.golive.domain.Status status,
        Pageable pageable
    );
}


