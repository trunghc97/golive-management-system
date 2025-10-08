package com.golive.repository;

import com.golive.domain.ComponentMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComponentMasterRepository extends JpaRepository<ComponentMaster, Long> {
    Optional<ComponentMaster> findByCode(String code);
}


