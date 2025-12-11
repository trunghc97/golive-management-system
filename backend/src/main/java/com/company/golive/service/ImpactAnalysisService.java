package com.company.golive.service;

import com.company.golive.domain.ChangeServiceDeploymentEntity;
import com.company.golive.domain.ServiceDependencyEntity;
import com.company.golive.dto.ImpactAnalysisDTO;
import com.company.golive.repository.ChangeServiceDeploymentRepository;
import com.company.golive.repository.ServiceDependencyRepository;
import com.company.golive.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ImpactAnalysisService {

    private final ServiceRepository serviceRepository;
    private final ServiceDependencyRepository dependencyRepository;
    private final ChangeServiceDeploymentRepository deploymentRepository;

    public ImpactAnalysisDTO analyzeImpact(Long changeId, Long serviceId) {
        log.debug("Analyzing impact for service {} in change {}", serviceId, changeId);

        var service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found: " + serviceId));

        // Get upstream dependencies (services this service depends on)
        List<String> upstream = getUpstreamServices(serviceId);

        // Get downstream dependencies (services that depend on this service)
        List<String> downstream = getDownstreamServices(serviceId);

        // Get cross-change risks (services depending on this service that are NOT in
        // the current change)
        List<String> crossChangeRisk = getCrossChangeRisks(changeId, serviceId, downstream);

        return ImpactAnalysisDTO.builder()
                .serviceCode(service.getCode())
                .serviceName(service.getName())
                .upstream(upstream)
                .downstream(downstream)
                .crossChangeRisk(crossChangeRisk)
                .build();
    }

    public List<ImpactAnalysisDTO> analyzeChangeImpact(Long changeId) {
        log.debug("Analyzing impact for all services in change {}", changeId);

        List<ChangeServiceDeploymentEntity> deployments = deploymentRepository.findByChangeId(changeId);

        return deployments.stream()
                .map(d -> analyzeImpact(changeId, d.getService().getId()))
                .collect(Collectors.toList());
    }

    private List<String> getUpstreamServices(Long serviceId) {
        // Services that this service depends on (from_service_id = serviceId)
        List<ServiceDependencyEntity> dependencies = dependencyRepository.findByFromServiceId(serviceId);
        return dependencies.stream()
                .map(d -> d.getToService().getCode())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    private List<String> getDownstreamServices(Long serviceId) {
        // Services that depend on this service (to_service_id = serviceId)
        List<ServiceDependencyEntity> dependencies = dependencyRepository.findByToServiceId(serviceId);
        return dependencies.stream()
                .map(d -> d.getFromService().getCode())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    private List<String> getCrossChangeRisks(Long changeId, Long serviceId, List<String> downstreamCodes) {
        // Get all services in the current change
        List<ChangeServiceDeploymentEntity> changeDeployments = deploymentRepository.findByChangeId(changeId);
        Set<String> servicesInChange = changeDeployments.stream()
                .map(d -> d.getService().getCode())
                .collect(Collectors.toSet());

        // Find downstream services NOT in the current change
        return downstreamCodes.stream()
                .filter(code -> !servicesInChange.contains(code))
                .sorted()
                .collect(Collectors.toList());
    }

    public Map<String, List<String>> getDependencyGraph() {
        log.debug("Building complete dependency graph");

        List<ServiceDependencyEntity> allDependencies = dependencyRepository.findAll();

        Map<String, List<String>> graph = new HashMap<>();

        for (ServiceDependencyEntity dep : allDependencies) {
            String fromCode = dep.getFromService().getCode();
            String toCode = dep.getToService().getCode();

            graph.computeIfAbsent(fromCode, k -> new ArrayList<>()).add(toCode);
        }

        return graph;
    }
}
