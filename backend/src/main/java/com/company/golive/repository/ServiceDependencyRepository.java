package com.company.golive.repository;

import com.company.golive.domain.ServiceDependencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceDependencyRepository
        extends JpaRepository<ServiceDependencyEntity, Long> {

    @Query("SELECT sd FROM ServiceDependencyEntity sd WHERE sd.fromService.id = :serviceId")
    List<ServiceDependencyEntity> findByFromServiceId(@Param("serviceId") Long serviceId);

    @Query("SELECT sd FROM ServiceDependencyEntity sd WHERE sd.toService.id = :serviceId")
    List<ServiceDependencyEntity> findByToServiceId(@Param("serviceId") Long serviceId);

    @Query("SELECT sd FROM ServiceDependencyEntity sd WHERE sd.fromService.id = :serviceId OR sd.toService.id = :serviceId")
    List<ServiceDependencyEntity> findAllByServiceId(@Param("serviceId") Long serviceId);
}
