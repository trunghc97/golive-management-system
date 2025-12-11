package com.company.golive.repository;

import com.company.golive.domain.ChangeServiceDeploymentEntity;
import com.company.golive.domain.DeploymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChangeServiceDeploymentRepository extends JpaRepository<ChangeServiceDeploymentEntity, Long> {

        List<ChangeServiceDeploymentEntity> findByChangeId(Long changeId);

        List<ChangeServiceDeploymentEntity> findByServiceId(Long serviceId);

        List<ChangeServiceDeploymentEntity> findByStatus(DeploymentStatus status);

        @Query("SELECT d FROM ChangeServiceDeploymentEntity d WHERE d.deployStart >= :from AND d.deployStart < :to ORDER BY d.deployStart")
        List<ChangeServiceDeploymentEntity> findByDeployStartBetween(
                        @Param("from") LocalDateTime from,
                        @Param("to") LocalDateTime to);

        @Query("SELECT d FROM ChangeServiceDeploymentEntity d WHERE d.service.id = :serviceId AND d.change.id != :changeId")
        List<ChangeServiceDeploymentEntity> findByServiceIdExcludingChange(
                        @Param("serviceId") Long serviceId,
                        @Param("changeId") Long changeId);
}
