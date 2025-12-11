package com.company.golive.dto;

import com.company.golive.domain.DeploymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeServiceDeploymentDTO {
    private Long id;
    private Long changeId;
    private Long serviceId;
    private String serviceCode;
    private String serviceName;
    private String deployVersion;
    private String configVersion;
    private String mrUrl;
    private String pipelineUrl;
    private LocalDateTime deployStart;
    private LocalDateTime deployEnd;
    private DeploymentStatus status;
    private String notes;
}
