package com.company.golive.controller;

import com.company.golive.dto.ChangeServiceDeploymentDTO;
import com.company.golive.dto.DashboardDayDTO;
import com.company.golive.dto.DashboardWeekDTO;
import com.company.golive.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard and timeline views")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/day")
    @Operation(summary = "Get day view", description = "Retrieve all changes and deployments for a specific day")
    public ResponseEntity<DashboardDayDTO> getDayView(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        DashboardDayDTO dayView = dashboardService.getDayView(date);
        return ResponseEntity.ok(dayView);
    }

    @GetMapping("/week")
    @Operation(summary = "Get week view", description = "Retrieve all changes and deployments for a week")
    public ResponseEntity<DashboardWeekDTO> getWeekView(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start) {
        DashboardWeekDTO weekView = dashboardService.getWeekView(start);
        return ResponseEntity.ok(weekView);
    }

    @GetMapping("/services-deployed")
    @Operation(summary = "Get deployed services", description = "Retrieve all service deployments within a date range")
    public ResponseEntity<List<ChangeServiceDeploymentDTO>> getServicesDeployed(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        List<ChangeServiceDeploymentDTO> deployments = dashboardService.getServicesDeployed(from, to);
        return ResponseEntity.ok(deployments);
    }
}
