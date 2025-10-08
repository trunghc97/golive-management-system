package com.golive.repository;

import com.golive.domain.GoliveComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoliveComponentRepository extends JpaRepository<GoliveComponent, Long> {
    List<GoliveComponent> findByChangeId(Long changeId);
}


