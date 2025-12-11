package com.company.golive.controller;

import com.company.golive.domain.ChangeStatus;
import com.company.golive.dto.ChangeRequestDTO;
import com.company.golive.dto.ChangeServiceDeploymentDTO;
import com.company.golive.dto.CreateChangeRequestDTO;
import com.company.golive.dto.ImpactAnalysisDTO;
import com.company.golive.service.ChangeService;
import com.company.golive.service.ImpactAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/changes")
@RequiredArgsConstructor
@Tag(name = "Change Management", description = "Change request and deployment management")
public class ChangeController {

    private final ChangeService changeService;
    private final ImpactAnalysisService impactAnalysisService;

    @GetMapping
    @Operation(summary = "Get all changes", description = "Retrieve all change requests with optional filtering")
    public ResponseEntity<List<ChangeRequestDTO>> getChanges(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) Long system,
            @RequestParam(required = false) ChangeStatus status) {

        List<ChangeRequestDTO> changes;

        if (from != null && to != null) {
            changes = changeService.getChangesByDateRange(from, to, system, status);
        } else {
            changes = changeService.getAllChanges();
        }

        return ResponseEntity.ok(changes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get change by ID", description = "Retrieve a specific change request by its ID")
    public ResponseEntity<ChangeRequestDTO> getChangeById(@PathVariable Long id) {
        ChangeRequestDTO change = changeService.getChangeById(id);
        return ResponseEntity.ok(change);
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Get change by code", description = "Retrieve a specific change request by its code")
    public ResponseEntity<ChangeRequestDTO> getChangeByCode(@PathVariable String code) {
        ChangeRequestDTO change = changeService.getChangeByCode(code);
        return ResponseEntity.ok(change);
    }

    @GetMapping("/{id}/services")
    @Operation(summary = "Get change deployments", description = "Retrieve all service deployments for a specific change")
    public ResponseEntity<List<ChangeServiceDeploymentDTO>> getChangeDeployments(@PathVariable Long id) {
        List<ChangeServiceDeploymentDTO> deployments = changeService.getChangeDeployments(id);
        return ResponseEntity.ok(deployments);
    }

    @GetMapping("/{id}/impact")
    @Operation(summary = "Get change impact analysis", description = "Analyze the impact of all services in a change request")
    public ResponseEntity<List<ImpactAnalysisDTO>> getChangeImpact(@PathVariable Long id) {
        List<ImpactAnalysisDTO> impact = impactAnalysisService.analyzeChangeImpact(id);
        return ResponseEntity.ok(impact);
    }

    @PostMapping
    @Operation(summary = "Create change request", description = "Create a new change request with service deployments")
    public ResponseEntity<ChangeRequestDTO> createChange(@Valid @RequestBody CreateChangeRequestDTO dto) {
        ChangeRequestDTO created = changeService.createChange(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
