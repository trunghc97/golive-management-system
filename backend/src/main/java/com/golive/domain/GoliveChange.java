package com.golive.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "golive_change")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoliveChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "change_id", nullable = false, unique = true, length = 50)
    private String changeId;

    @Column(name = "team_name", nullable = false, length = 100)
    private String teamName;

    @Column(name = "registered_by", nullable = false, length = 100)
    private String registeredBy;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "golive_date", nullable = false)
    private LocalDate goliveDate;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "rollback_group_id", length = 50)
    private String rollbackGroupId;

    @Column(name = "conflict_flag")
    private Boolean conflictFlag = Boolean.FALSE;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private Status status = Status.PENDING;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "change", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GoliveComponent> components = new ArrayList<>();

    public boolean hasComponent(ComponentMaster component) {
        if (component == null || components == null) return false;
        return components.stream().anyMatch(gc -> gc.getComponent() != null && gc.getComponent().getId().equals(component.getId()));
    }
}


