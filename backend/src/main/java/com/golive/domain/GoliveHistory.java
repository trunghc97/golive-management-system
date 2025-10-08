package com.golive.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "golive_history")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoliveHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "change_id", nullable = false)
    private GoliveChange change;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    private ComponentMaster component;

    @Column(nullable = false, length = 30)
    private String action; // GOLIVE / ROLLBACK_PARTIAL / ROLLBACK_FULL

    @Column(nullable = false, length = 100)
    private String actor;

    @Column(name = "action_time")
    private LocalDateTime actionTime;

    @Column(columnDefinition = "TEXT")
    private String notes;
}


