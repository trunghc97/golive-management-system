package com.company.golive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardWeekDTO {
    private LocalDate weekStart;
    private LocalDate weekEnd;
    private List<DashboardDayDTO> days;
    private Integer totalChanges;
    private Integer totalDeployments;
}
