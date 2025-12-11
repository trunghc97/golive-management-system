package com.company.golive.mapper;

import com.company.golive.domain.*;
import com.company.golive.dto.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EntityMapper {

    // System mappings
    SystemDTO toSystemDTO(SystemEntity entity);

    List<SystemDTO> toSystemDTOs(List<SystemEntity> entities);

    // Service mappings
    @Mapping(source = "system.id", target = "systemId")
    @Mapping(source = "system.code", target = "systemCode")
    @Mapping(source = "system.name", target = "systemName")
    ServiceDTO toServiceDTO(ServiceEntity entity);

    List<ServiceDTO> toServiceDTOs(List<ServiceEntity> entities);

    // Service dependency mappings
    @Mapping(source = "fromService.id", target = "fromServiceId")
    @Mapping(source = "fromService.code", target = "fromServiceCode")
    @Mapping(source = "fromService.name", target = "fromServiceName")
    @Mapping(source = "toService.id", target = "toServiceId")
    @Mapping(source = "toService.code", target = "toServiceCode")
    @Mapping(source = "toService.name", target = "toServiceName")
    ServiceDependencyDTO toServiceDependencyDTO(ServiceDependencyEntity entity);

    List<ServiceDependencyDTO> toServiceDependencyDTOs(List<ServiceDependencyEntity> entities);

    // Change request mappings
    @Mapping(source = "system.id", target = "systemId")
    @Mapping(source = "system.code", target = "systemCode")
    @Mapping(source = "system.name", target = "systemName")
    ChangeRequestDTO toChangeRequestDTO(ChangeRequestEntity entity);

    List<ChangeRequestDTO> toChangeRequestDTOs(List<ChangeRequestEntity> entities);

    // Change service deployment mappings
    @Mapping(source = "change.id", target = "changeId")
    @Mapping(source = "service.id", target = "serviceId")
    @Mapping(source = "service.code", target = "serviceCode")
    @Mapping(source = "service.name", target = "serviceName")
    ChangeServiceDeploymentDTO toChangeServiceDeploymentDTO(ChangeServiceDeploymentEntity entity);

    List<ChangeServiceDeploymentDTO> toChangeServiceDeploymentDTOs(List<ChangeServiceDeploymentEntity> entities);

    // Create mappings
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "system", ignore = true)
    @Mapping(target = "deployments", ignore = true)
    ChangeRequestEntity toChangeRequestEntity(CreateChangeRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "change", ignore = true)
    @Mapping(target = "service", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    ChangeServiceDeploymentEntity toChangeServiceDeploymentEntity(CreateDeploymentDTO dto);
}
