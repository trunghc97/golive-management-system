package com.company.golive.dto;

import com.company.golive.domain.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private Long id;
    private String code;
    private String name;
    private ServiceType type;
    private Long systemId;
    private String systemCode;
    private String systemName;
    private String techStack;
    private String gitRepoUrl;
    private String deployPipelineUrl;
    private Boolean active;
}
