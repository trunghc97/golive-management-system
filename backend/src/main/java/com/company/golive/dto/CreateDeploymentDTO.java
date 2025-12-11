package com.company.golive.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDeploymentDTO {
    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotBlank(message = "Deploy version is required")
    private String deployVersion;

    private String configVersion;
    private String mrUrl;
    private String pipelineUrl;
    private String notes;
}
