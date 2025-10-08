package com.golive.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public class ChangeDtos {
    public record ChangeCreateRequest(
            @NotBlank String changeId,
            @NotBlank String team,
            @NotBlank String registeredBy,
            String description,
            @NotNull LocalDateTime startTime,
            @NotNull LocalDateTime endTime,
            @NotEmpty List<Long> componentIds
    ) {}

    public record ChangeUpdateRequest(
            String team,
            String registeredBy,
            String description,
            LocalDateTime startTime,
            LocalDateTime endTime,
            List<Long> componentIds
    ) {}

    public record StatusUpdateRequest(
            @NotBlank String status
    ) {}

    public record RollbackAllRequest(
            @NotBlank String actor,
            String notes
    ) {}

    public record RollbackComponentsRequest(
            @NotBlank String actor,
            @NotEmpty List<Long> componentIds,
            String notes
    ) {}

    public record ChangeResponse(
            Long id,
            String changeId,
            String team,
            String registeredBy,
            String description,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String status,
            boolean conflict,
            List<ComponentParticipation> components
    ) {}

    public record ComponentParticipation(
            Long componentId,
            String code,
            String name,
            boolean conflict,
            String rollbackStatus
    ) {}
}


