package com.golive.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TimelineDtos {
    public record TimelineResponse(
            String date,
            java.util.List<TimelineComponentDTO> components
    ) {}

    public record TimelineComponentDTO(
            String componentName,
            boolean hasConflict,
            java.util.List<ChangeSummaryDTO> changes
    ) {}

    public record ChangeSummaryDTO(
            String changeId,
            String team,
            String registeredBy,
            java.time.LocalDateTime startTime,
            java.time.LocalDateTime endTime,
            String status
    ) {}

    public record TimelineRow(
            String component,
            List<TimelineChange> changes
    ) {}

    public record TimelineChange(
            String changeId,
            String team,
            String registeredBy,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String status,
            boolean conflict
    ) {}
}


