package com.company.golive.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "change_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangeRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "change_code", nullable = false, unique = true, length = 50)
    private String changeCode;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "system_id", nullable = false)
    private SystemEntity system;

    @Column(nullable = false, length = 100)
    private String requester;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String environment = "PRODUCTION";

    @Column(name = "planned_start", nullable = false)
    private LocalDateTime plannedStart;

    @Column(name = "planned_end", nullable = false)
    private LocalDateTime plannedEnd;

    @Column(name = "actual_start")
    private LocalDateTime actualStart;

    @Column(name = "actual_end")
    private LocalDateTime actualEnd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private ChangeStatus status = ChangeStatus.DRAFT;

    @Column(name = "jira_ticket", length = 50)
    private String jiraTicket;

    @OneToMany(mappedBy = "change", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ChangeServiceDeploymentEntity> deployments = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
