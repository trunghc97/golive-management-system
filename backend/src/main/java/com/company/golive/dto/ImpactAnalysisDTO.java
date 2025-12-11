package com.company.golive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImpactAnalysisDTO {
    private String serviceCode;
    private String serviceName;
    private List<String> upstream;
    private List<String> downstream;
    private List<String> crossChangeRisk;
}
