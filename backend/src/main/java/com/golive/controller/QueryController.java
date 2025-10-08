package com.golive.controller;

import com.golive.domain.ComponentMaster;
import com.golive.dto.ComponentDtos.*;
import com.golive.dto.TimelineDtos.*;
import com.golive.repository.ComponentMasterRepository;
import com.golive.repository.GoliveChangeRepository;
import com.golive.util.DateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequiredArgsConstructor
public class QueryController {
    private final ComponentMasterRepository componentRepo;
    private final GoliveChangeRepository changeRepo;

    @GetMapping("/api/components")
    public ResponseEntity<List<ComponentItem>> components() {
        List<ComponentItem> items = componentRepo.findAll().stream()
                .map(c -> new ComponentItem(c.getId(), c.getCode(), c.getName(), c.getType(), Boolean.TRUE.equals(c.getActive())))
                .toList();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/api/timeline")
    public ResponseEntity<List<TimelineRow>> timeline(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        var range = DateUtils.getLogicalDayRange(date);
        var start = range[0];
        var end = range[1];

        // load all components and build rows
        Map<Long, TimelineRow> rows = new LinkedHashMap<>();
        List<ComponentMaster> components = componentRepo.findAll();
        for (ComponentMaster c : components) {
            rows.put(c.getId(), new TimelineRow(c.getCode(), new ArrayList<>()));
        }

        // naive approach: fetch all changes in approximate window (simple since we lack spec repo method)
        var changes = changeRepo.findAll().stream()
                .filter(c -> !(c.getEndTime().isBefore(start) || c.getStartTime().isAfter(end)))
                .toList();

        for (var ch : changes) {
            var tlChange = new TimelineChange(
                    ch.getChangeId(),
                    ch.getTeamName(),
                    ch.getRegisteredBy(),
                    ch.getStartTime(),
                    ch.getEndTime(),
                    ch.getStatus().name(),
                    Boolean.TRUE.equals(ch.getConflictFlag())
            );
            for (var gc : ch.getComponents()) {
                var row = rows.get(gc.getComponent().getId());
                if (row != null) {
                    row.changes().add(tlChange);
                }
            }
        }

        return ResponseEntity.ok(new ArrayList<>(rows.values()));
    }
}


