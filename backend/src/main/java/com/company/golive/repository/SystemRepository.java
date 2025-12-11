package com.company.golive.repository;

import com.company.golive.domain.SystemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemRepository extends JpaRepository<SystemEntity, Long> {
    Optional<SystemEntity> findByCode(String code);
}
