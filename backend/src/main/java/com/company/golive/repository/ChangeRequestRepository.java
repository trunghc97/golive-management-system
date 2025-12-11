package com.company.golive.repository;

import com.company.golive.domain.ChangeRequestEntity;
import com.company.golive.domain.ChangeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChangeRequestRepository
        extends JpaRepository<ChangeRequestEntity, Long> {

    Optional<ChangeRequestEntity> findByChangeCode(String changeCode);

    List<ChangeRequestEntity> findByStatus(ChangeStatus status);

    List<ChangeRequestEntity> findBySystemId(Long systemId);

    @Query("SELECT c FROM ChangeRequestEntity c WHERE c.plannedStart >= :from AND c.plannedStart < :to ORDER BY c.plannedStart")
    List<ChangeRequestEntity> findByPlannedStartBetween(@Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to);

    @Query("SELECT c FROM ChangeRequestEntity c WHERE c.plannedStart >= :from AND c.plannedStart < :to AND c.system.id = :systemId ORDER BY c.plannedStart")
    List<ChangeRequestEntity> findByPlannedStartBetweenAndSystemId(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("systemId") Long systemId);

    @Query("SELECT c FROM ChangeRequestEntity c WHERE c.plannedStart >= :from AND c.plannedStart < :to AND c.status = :status ORDER BY c.plannedStart")
    List<ChangeRequestEntity> findByPlannedStartBetweenAndStatus(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("status") ChangeStatus status);
}
