package com.company.golive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemDTO {
    private Long id;
    private String code;
    private String name;
    private String ownerDept;
    private String description;
}
