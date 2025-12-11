package com.company.golive.service;

import com.company.golive.domain.ChangeRequestEntity;
import com.company.golive.domain.ChangeServiceDeploymentEntity;
import com.company.golive.dto.*;
import com.company.golive.mapper.EntityMapper;
import com.company.golive.repository.ChangeRequestRepository;
import com.company.golive.repository.ChangeServiceDeploymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardService {

    private final ChangeRequestRepository changeRepository;
    private final ChangeServiceDeploymentRepository deploymentRepository;
    private final EntityMapper mapper;

    public DashboardDayDTO getDayView(LocalDate date) {
        log.debug("Fetching dashboard for day: {}", date);

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        List<ChangeRequestEntity> changes = changeRepository.findByPlannedStartBetween(startOfDay, endOfDay);
        List<ChangeRequestDTO> changeDTOs = mapper.toChangeRequestDTOs(changes);

        int totalDeployments = changes.stream()
                .mapToInt(c -> c.getDeployments().size())
                .sum();

        return DashboardDayDTO.builder()
                .date(date)
                .changes(changeDTOs)
                .totalChanges(changes.size())
                .totalDeployments(totalDeployments)
                .build();
    }

    public DashboardWeekDTO getWeekView(LocalDate weekStart) {
        log.debug("Fetching dashboard for week starting: {}", weekStart);

        LocalDate weekEnd = weekStart.plusDays(6);
        List<DashboardDayDTO> days = new ArrayList<>();

        int totalChanges = 0;
        int totalDeployments = 0;

        for (LocalDate date = weekStart; !date.isAfter(weekEnd); date = date.plusDays(1)) {
            DashboardDayDTO dayView = getDayView(date);
            days.add(dayView);
            totalChanges += dayView.getTotalChanges();
            totalDeployments += dayView.getTotalDeployments();
        }

        return DashboardWeekDTO.builder()
                .weekStart(weekStart)
                .weekEnd(weekEnd)
                .days(days)
                .totalChanges(totalChanges)
                .totalDeployments(totalDeployments)
                .build();
    }

    public List<ChangeServiceDeploymentDTO> getServicesDeployed(LocalDateTime from, LocalDateTime to) {
        log.debug("Fetching services deployed from {} to {}", from, to);

        List<ChangeServiceDeploymentEntity> deployments = deploymentRepository.findByDeployStartBetween(from, to);
        return mapper.toChangeServiceDeploymentDTOs(deployments);
    }
}
