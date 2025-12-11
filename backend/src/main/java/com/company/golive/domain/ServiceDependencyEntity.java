package com.company.golive.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_dependency")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceDependencyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_service_id", nullable = false)
    private ServiceEntity fromService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_service_id", nullable = false)
    private ServiceEntity toService;

    @Column(name = "dependency_type", nullable = false, length = 50)
    @Builder.Default
    private String dependencyType = "API";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
