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
    public ResponseEntity<TimelineResponse> timeline(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        var range = DateUtils.getLogicalDayRange(date);
        var start = range[0];
        var end = range[1];

        Map<String, TimelineComponentDTO> dtoByCode = new LinkedHashMap<>();
        List<ComponentMaster> components = componentRepo.findAll();
        for (ComponentMaster c : components) {
            dtoByCode.put(c.getCode(), new TimelineComponentDTO(c.getCode(), false, new ArrayList<>()));
        }

        var changes = changeRepo.findAll().stream()
                .filter(c -> !(c.getEndTime().isBefore(start) || c.getStartTime().isAfter(end)))
                .toList();

        for (var ch : changes) {
            var changeDto = new ChangeSummaryDTO(
                    ch.getChangeId(),
                    ch.getTeamName(),
                    ch.getRegisteredBy(),
                    ch.getStartTime(),
                    ch.getEndTime(),
                    ch.getStatus().name()
            );
            boolean conflict = Boolean.TRUE.equals(ch.getConflictFlag());
            for (var gc : ch.getComponents()) {
                var compCode = gc.getComponent().getCode();
                var row = dtoByCode.get(compCode);
                if (row != null) {
                    row.changes().add(changeDto);
                    if (conflict || Boolean.TRUE.equals(gc.getConflictFlag())) {
                        // replace with a new record with hasConflict=true because Java records are immutable
                        dtoByCode.put(compCode, new TimelineComponentDTO(row.componentName(), true, row.changes()));
                    }
                }
            }
        }

        var response = new TimelineResponse(date.toString(), new ArrayList<>(dtoByCode.values()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/components/summary")
    public ResponseEntity<List<Map<String, Object>>> componentSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        var changes = changeRepo.findAllByGoliveDateBetween(from, to);
        Map<String, List<Map<String, Object>>> grouped = new LinkedHashMap<>();
        for (var ch : changes) {
            for (var gc : ch.getComponents()) {
                var comp = gc.getComponent().getCode();
                grouped.computeIfAbsent(comp, k -> new ArrayList<>()).add(Map.of(
                        "changeId", ch.getChangeId(),
                        "date", ch.getGoliveDate().toString(),
                        "status", ch.getStatus().name()
                ));
            }
        }
        List<Map<String, Object>> response = new ArrayList<>();
        for (var entry : grouped.entrySet()) {
            var list = entry.getValue();
            list.sort(Comparator.comparing(m -> (String) m.get("date"))); // asc
            response.add(Map.of(
                    "component", entry.getKey(),
                    "timeline", list
            ));
        }
        return ResponseEntity.ok(response);
    }
}


