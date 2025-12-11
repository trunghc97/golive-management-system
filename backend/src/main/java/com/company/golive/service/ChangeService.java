package com.company.golive.service;

import com.company.golive.domain.*;
import com.company.golive.dto.*;
import com.company.golive.mapper.EntityMapper;
import com.company.golive.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ChangeService {

    private final ChangeRequestRepository changeRepository;
    private final ChangeServiceDeploymentRepository deploymentRepository;
    private final SystemRepository systemRepository;
    private final ServiceRepository serviceRepository;
    private final EntityMapper mapper;

    public List<ChangeRequestDTO> getAllChanges() {
        log.debug("Fetching all change requests");
        List<ChangeRequestEntity> changes = changeRepository.findAll();
        return mapper.toChangeRequestDTOs(changes);
    }

    public List<ChangeRequestDTO> getChangesByDateRange(LocalDateTime from, LocalDateTime to, Long systemId,
            ChangeStatus status) {
        log.debug("Fetching changes from {} to {}, system: {}, status: {}", from, to, systemId, status);

        List<ChangeRequestEntity> changes;

        if (systemId != null && status != null) {
            changes = changeRepository.findByPlannedStartBetweenAndSystemId(from, to, systemId)
                    .stream()
                    .filter(c -> c.getStatus() == status)
                    .toList();
        } else if (systemId != null) {
            changes = changeRepository.findByPlannedStartBetweenAndSystemId(from, to, systemId);
        } else if (status != null) {
            changes = changeRepository.findByPlannedStartBetweenAndStatus(from, to, status);
        } else {
            changes = changeRepository.findByPlannedStartBetween(from, to);
        }

        return mapper.toChangeRequestDTOs(changes);
    }

    public ChangeRequestDTO getChangeById(Long id) {
        log.debug("Fetching change request by id: {}", id);
        ChangeRequestEntity change = changeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Change request not found: " + id));
        return mapper.toChangeRequestDTO(change);
    }

    public ChangeRequestDTO getChangeByCode(String code) {
        log.debug("Fetching change request by code: {}", code);
        ChangeRequestEntity change = changeRepository.findByChangeCode(code)
                .orElseThrow(() -> new RuntimeException("Change request not found: " + code));
        return mapper.toChangeRequestDTO(change);
    }

    public List<ChangeServiceDeploymentDTO> getChangeDeployments(Long changeId) {
        log.debug("Fetching deployments for change: {}", changeId);
        List<ChangeServiceDeploymentEntity> deployments = deploymentRepository.findByChangeId(changeId);
        return mapper.toChangeServiceDeploymentDTOs(deployments);
    }

    @Transactional
    public ChangeRequestDTO createChange(CreateChangeRequestDTO dto) {
        log.info("Creating new change request: {}", dto.getChangeCode());

        // Validate system exists
        SystemEntity system = systemRepository.findById(dto.getSystemId())
                .orElseThrow(() -> new RuntimeException("System not found: " + dto.getSystemId()));

        // Create change entity
        ChangeRequestEntity change = mapper.toChangeRequestEntity(dto);
        change.setSystem(system);

        if (change.getStatus() == null) {
            change.setStatus(ChangeStatus.DRAFT);
        }

        // Create deployments if provided
        if (dto.getDeployments() != null && !dto.getDeployments().isEmpty()) {
            List<ChangeServiceDeploymentEntity> deployments = new ArrayList<>();

            for (CreateDeploymentDTO deployDto : dto.getDeployments()) {
                ServiceEntity service = serviceRepository.findById(deployDto.getServiceId())
                        .orElseThrow(() -> new RuntimeException("Service not found: " + deployDto.getServiceId()));

                ChangeServiceDeploymentEntity deployment = mapper.toChangeServiceDeploymentEntity(deployDto);
                deployment.setChange(change);
                deployment.setService(service);
                deployments.add(deployment);
            }

            change.setDeployments(deployments);
        }

        ChangeRequestEntity saved = changeRepository.save(change);
        log.info("Created change request: {} with id: {}", saved.getChangeCode(), saved.getId());

        return mapper.toChangeRequestDTO(saved);
    }
}
