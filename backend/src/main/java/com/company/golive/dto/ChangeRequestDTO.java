package com.company.golive.dto;

import com.company.golive.domain.ChangeStatus;
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
public class ChangeRequestDTO {
    private Long id;
    private String changeCode;
    private String title;
    private String description;
    private Long systemId;
    private String systemCode;
    private String systemName;
    private String requester;
    private String environment;
    private LocalDateTime plannedStart;
    private LocalDateTime plannedEnd;
    private LocalDateTime actualStart;
    private LocalDateTime actualEnd;
    private ChangeStatus status;
    private String jiraTicket;
    private List<ChangeServiceDeploymentDTO> deployments;
}
