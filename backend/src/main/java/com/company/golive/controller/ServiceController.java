package com.company.golive.controller;

import com.company.golive.domain.ServiceType;
import com.company.golive.dto.ServiceDTO;
import com.company.golive.dto.ServiceDependencyDTO;
import com.company.golive.service.ServiceCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Tag(name = "Service Catalog", description = "Service catalog and dependency management")
public class ServiceController {

    private final ServiceCatalogService serviceCatalogService;

    @GetMapping
    @Operation(summary = "Get all services", description = "Retrieve all services with optional filtering by system and type")
    public ResponseEntity<List<ServiceDTO>> getServices(
            @RequestParam(required = false) Long system,
            @RequestParam(required = false) ServiceType type) {

        List<ServiceDTO> services;

        if (system != null && type != null) {
            services = serviceCatalogService.getServicesBySystemAndType(system, type);
        } else if (system != null) {
            services = serviceCatalogService.getServicesBySystem(system);
        } else if (type != null) {
            services = serviceCatalogService.getServicesByType(type);
        } else {
            services = serviceCatalogService.getAllServices();
        }

        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service by ID", description = "Retrieve a specific service by its ID")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable Long id) {
        ServiceDTO service = serviceCatalogService.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get service by code", description = "Retrieve a specific service by its code")
    public ResponseEntity<ServiceDTO> getServiceByCode(@PathVariable String code) {
        ServiceDTO service = serviceCatalogService.getServiceByCode(code);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/{id}/dependencies")
    @Operation(summary = "Get service dependencies", description = "Retrieve all dependencies for a specific service")
    public ResponseEntity<List<ServiceDependencyDTO>> getServiceDependencies(@PathVariable Long id) {
        List<ServiceDependencyDTO> dependencies = serviceCatalogService.getServiceDependencies(id);
        return ResponseEntity.ok(dependencies);
    }
}
