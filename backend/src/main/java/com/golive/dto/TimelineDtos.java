package com.golive.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TimelineDtos {
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


