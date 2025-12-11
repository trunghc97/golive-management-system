package com.company.golive.repository;

import com.company.golive.domain.ServiceEntity;
import com.company.golive.domain.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    Optional<ServiceEntity> findByCode(String code);

    List<ServiceEntity> findBySystemId(Long systemId);

    List<ServiceEntity> findByType(ServiceType type);

    List<ServiceEntity> findBySystemIdAndType(Long systemId, ServiceType type);

    List<ServiceEntity> findByActiveTrue();

    @Query("SELECT s FROM ServiceEntity s WHERE s.system.id = :systemId AND s.active = true")
    List<ServiceEntity> findActiveBySystemId(@Param("systemId") Long systemId);
}
