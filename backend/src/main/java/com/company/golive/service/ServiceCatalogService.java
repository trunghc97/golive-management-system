package com.company.golive.service;

import com.company.golive.domain.ServiceEntity;
import com.company.golive.domain.ServiceType;
import com.company.golive.dto.ServiceDTO;
import com.company.golive.dto.ServiceDependencyDTO;
import com.company.golive.mapper.EntityMapper;
import com.company.golive.repository.ServiceDependencyRepository;
import com.company.golive.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ServiceCatalogService {

    private final ServiceRepository serviceRepository;
    private final ServiceDependencyRepository dependencyRepository;
    private final EntityMapper mapper;

    public List<ServiceDTO> getAllServices() {
        log.debug("Fetching all services");
        List<ServiceEntity> services = serviceRepository.findAll();
        return mapper.toServiceDTOs(services);
    }

    public List<ServiceDTO> getServicesBySystem(Long systemId) {
        log.debug("Fetching services for system: {}", systemId);
        List<ServiceEntity> services = serviceRepository.findBySystemId(systemId);
        return mapper.toServiceDTOs(services);
    }

    public List<ServiceDTO> getServicesByType(ServiceType type) {
        log.debug("Fetching services by type: {}", type);
        List<ServiceEntity> services = serviceRepository.findByType(type);
        return mapper.toServiceDTOs(services);
    }

    public List<ServiceDTO> getServicesBySystemAndType(Long systemId, ServiceType type) {
        log.debug("Fetching services for system: {} and type: {}", systemId, type);
        List<ServiceEntity> services = serviceRepository.findBySystemIdAndType(systemId, type);
        return mapper.toServiceDTOs(services);
    }

    public ServiceDTO getServiceById(Long id) {
        log.debug("Fetching service by id: {}", id);
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found: " + id));
        return mapper.toServiceDTO(service);
    }

    public ServiceDTO getServiceByCode(String code) {
        log.debug("Fetching service by code: {}", code);
        ServiceEntity service = serviceRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Service not found: " + code));
        return mapper.toServiceDTO(service);
    }

    public List<ServiceDependencyDTO> getServiceDependencies(Long serviceId) {
        log.debug("Fetching dependencies for service: {}", serviceId);
        var dependencies = dependencyRepository.findAllByServiceId(serviceId);
        return mapper.toServiceDependencyDTOs(dependencies);
    }

    public List<ServiceDependencyDTO> getUpstreamDependencies(Long serviceId) {
        log.debug("Fetching upstream dependencies for service: {}", serviceId);
        var dependencies = dependencyRepository.findByFromServiceId(serviceId);
        return mapper.toServiceDependencyDTOs(dependencies);
    }

    public List<ServiceDependencyDTO> getDownstreamDependencies(Long serviceId) {
        log.debug("Fetching downstream dependencies for service: {}", serviceId);
        var dependencies = dependencyRepository.findByToServiceId(serviceId);
        return mapper.toServiceDependencyDTOs(dependencies);
    }
}
