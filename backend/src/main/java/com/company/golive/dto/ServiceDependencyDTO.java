package com.company.golive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDependencyDTO {
    private Long id;
    private Long fromServiceId;
    private String fromServiceCode;
    private String fromServiceName;
    private Long toServiceId;
    private String toServiceCode;
    private String toServiceName;
    private String dependencyType;
}
