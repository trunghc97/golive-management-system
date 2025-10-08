package com.golive.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "golive_component")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoliveComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "change_id", nullable = false)
    private GoliveChange change;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    private ComponentMaster component;

    @Column(name = "conflict_flag")
    private Boolean conflictFlag = Boolean.FALSE;

    @Column(name = "rollback_flag")
    private Boolean rollbackFlag = Boolean.FALSE;

    @Column(name = "rollback_status", length = 30)
    private String rollbackStatus = "NONE"; // NONE / PARTIAL / FULL

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}


