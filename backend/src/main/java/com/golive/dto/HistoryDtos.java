package com.golive.dto;

import java.time.LocalDateTime;

public class HistoryDtos {
    public record HistoryItem(Long id, Long componentId, String componentCode, String action, String actor, LocalDateTime actionTime, String notes) {}
}


