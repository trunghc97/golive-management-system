package com.golive.service;

import com.golive.domain.*;
import com.golive.dto.ChangeDtos.*;
import com.golive.mapper.ChangeMapper;
import com.golive.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoliveService {
    private final GoliveChangeRepository changeRepository;
    private final GoliveComponentRepository componentRepository;
    private final ComponentMasterRepository componentMasterRepository;
    private final GoliveHistoryRepository historyRepository;
    private final ChangeMapper changeMapper;

    @Transactional
    public ChangeResponse create(ChangeCreateRequest req) {
        GoliveChange change = new GoliveChange();
        change.setChangeId(req.changeId());
        change.setTeamName(req.team());
        change.setRegisteredBy(req.registeredBy());
        change.setDescription(req.description());
        change.setStartTime(req.startTime());
        change.setEndTime(req.endTime());
        change.setGoliveDate(LocalDate.from(req.startTime()));
        change.setStatus(Status.PENDING);

        List<GoliveComponent> components = new ArrayList<>();
        for (Long compId : req.componentIds()) {
            ComponentMaster cm = componentMasterRepository.findById(compId).orElseThrow();
            GoliveComponent gc = new GoliveComponent();
            gc.setChange(change);
            gc.setComponent(cm);
            components.add(gc);
        }
        change.setComponents(components);

        // detect conflicts
        List<Long> componentIds = req.componentIds();
        var overlapping = changeRepository.findConflicts(req.startTime(), req.endTime(), componentIds, null);
        boolean conflict = !overlapping.isEmpty();
        change.setConflictFlag(conflict);

        GoliveChange saved = changeRepository.save(change);

        if (conflict) {
            overlapping.forEach(c -> c.setConflictFlag(true));
            changeRepository.saveAll(overlapping);
            // mark component level conflict
            for (GoliveComponent gc : saved.getComponents()) {
                boolean compConflict = overlapping.stream().anyMatch(o -> o.getComponents().stream()
                        .anyMatch(oc -> oc.getComponent().getId().equals(gc.getComponent().getId())));
                if (compConflict) gc.setConflictFlag(true);
            }
        }

        // history log for creation (GOLIVE)
        for (GoliveComponent gc : saved.getComponents()) {
            GoliveHistory h = new GoliveHistory();
            h.setChange(saved);
            h.setComponent(gc.getComponent());
            h.setAction("GOLIVE");
            h.setActor(saved.getRegisteredBy());
            historyRepository.save(h);
        }

        return changeMapper.toResponse(saved);
    }

    @Transactional
    public ChangeResponse update(Long id, ChangeUpdateRequest req) {
        GoliveChange change = changeRepository.findById(id).orElseThrow();
        if (req.team() != null) change.setTeamName(req.team());
        if (req.registeredBy() != null) change.setRegisteredBy(req.registeredBy());
        if (req.description() != null) change.setDescription(req.description());
        if (req.startTime() != null) change.setStartTime(req.startTime());
        if (req.endTime() != null) change.setEndTime(req.endTime());
        if (req.componentIds() != null && !req.componentIds().isEmpty()) {
            change.getComponents().clear();
            for (Long compId : req.componentIds()) {
                ComponentMaster cm = componentMasterRepository.findById(compId).orElseThrow();
                GoliveComponent gc = new GoliveComponent();
                gc.setChange(change);
                gc.setComponent(cm);
                change.getComponents().add(gc);
            }
        }

        var componentIds = change.getComponents().stream().map(gc -> gc.getComponent().getId()).toList();
        var overlapping = changeRepository.findConflicts(change.getStartTime(), change.getEndTime(), componentIds, change.getId());
        boolean conflict = !overlapping.isEmpty();
        change.setConflictFlag(conflict);
        if (conflict) {
            overlapping.forEach(c -> c.setConflictFlag(true));
            changeRepository.saveAll(overlapping);
        }
        change.getComponents().forEach(gc -> {
            boolean compConflict = overlapping.stream().anyMatch(o -> o.getComponents().stream()
                    .anyMatch(oc -> oc.getComponent().getId().equals(gc.getComponent().getId())));
            gc.setConflictFlag(compConflict);
        });
        return changeMapper.toResponse(change);
    }

    @Transactional
    public ChangeResponse updateStatus(Long id, StatusUpdateRequest req) {
        GoliveChange change = changeRepository.findById(id).orElseThrow();
        change.setStatus(Status.valueOf(req.status()));
        return changeMapper.toResponse(change);
    }

    @Transactional
    public ChangeResponse rollbackAll(Long id, RollbackAllRequest req) {
        GoliveChange change = changeRepository.findById(id).orElseThrow();
        change.setStatus(Status.ROLLBACK_ALL);
        for (GoliveComponent gc : change.getComponents()) {
            gc.setRollbackFlag(true);
            gc.setRollbackStatus("FULL");
            GoliveHistory h = new GoliveHistory();
            h.setChange(change);
            h.setComponent(gc.getComponent());
            h.setAction("ROLLBACK_FULL");
            h.setActor(req.actor());
            h.setNotes(req.notes());
            historyRepository.save(h);
        }
        return changeMapper.toResponse(change);
    }

    @Transactional
    public ChangeResponse rollbackComponents(Long id, RollbackComponentsRequest req) {
        GoliveChange change = changeRepository.findById(id).orElseThrow();
        change.setStatus(Status.ROLLBACK_PARTIAL);
        for (GoliveComponent gc : change.getComponents()) {
            if (req.componentIds().contains(gc.getComponent().getId())) {
                gc.setRollbackFlag(true);
                gc.setRollbackStatus("PARTIAL");
                GoliveHistory h = new GoliveHistory();
                h.setChange(change);
                h.setComponent(gc.getComponent());
                h.setAction("ROLLBACK_PARTIAL");
                h.setActor(req.actor());
                h.setNotes(req.notes());
                historyRepository.save(h);
            }
        }
        return changeMapper.toResponse(change);
    }
}


