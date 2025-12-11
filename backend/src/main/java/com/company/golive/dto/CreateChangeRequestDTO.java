package com.company.golive.dto;

import com.company.golive.domain.ChangeStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateChangeRequestDTO {
    @NotBlank(message = "Change code is required")
    private String changeCode;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "System ID is required")
    private Long systemId;

    @NotBlank(message = "Requester is required")
    private String requester;

    @NotBlank(message = "Environment is required")
    private String environment;

    @NotNull(message = "Planned start time is required")
    private LocalDateTime plannedStart;

    @NotNull(message = "Planned end time is required")
    private LocalDateTime plannedEnd;

    private ChangeStatus status;
    private String jiraTicket;
    private List<CreateDeploymentDTO> deployments;
}
