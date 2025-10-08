package com.golive.controller;

import com.golive.domain.GoliveChange;
import com.golive.dto.HistoryDtos.HistoryItem;
import com.golive.repository.GoliveChangeRepository;
import com.golive.repository.GoliveHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HistoryController {
    private final GoliveChangeRepository changeRepo;
    private final GoliveHistoryRepository historyRepo;

    @GetMapping("/api/history")
    public ResponseEntity<List<HistoryItem>> historyByChangeId(@RequestParam("changeId") String externalChangeId) {
        GoliveChange change = changeRepo.findAll().stream()
                .filter(c -> c.getChangeId().equals(externalChangeId))
                .findFirst()
                .orElseThrow();
        var items = historyRepo.findByChangeIdOrderByActionTimeAsc(change.getId()).stream().map(h ->
                new HistoryItem(
                        h.getId(),
                        h.getComponent().getId(),
                        h.getComponent().getCode(),
                        h.getAction(),
                        h.getActor(),
                        h.getActionTime(),
                        h.getNotes()
                )
        ).toList();
        return ResponseEntity.ok(items);
    }
}


