package com.company.golive.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "change_service_deployment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangeServiceDeploymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "change_id", nullable = false)
    private ChangeRequestEntity change;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Column(name = "deploy_version", nullable = false, length = 100)
    private String deployVersion;

    @Column(name = "config_version", length = 100)
    private String configVersion;

    @Column(name = "mr_url", length = 500)
    private String mrUrl;

    @Column(name = "pipeline_url", length = 500)
    private String pipelineUrl;

    @Column(name = "deploy_start")
    private LocalDateTime deployStart;

    @Column(name = "deploy_end")
    private LocalDateTime deployEnd;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private DeploymentStatus status = DeploymentStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

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
