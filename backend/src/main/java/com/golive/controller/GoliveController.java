package com.golive.controller;

import com.golive.dto.ChangeDtos.*;
import com.golive.service.GoliveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/changes")
@RequiredArgsConstructor
public class GoliveController {
    private final GoliveService service;

    @PostMapping
    public ResponseEntity<ChangeResponse> create(@Valid @RequestBody ChangeCreateRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChangeResponse> update(@PathVariable Long id, @Valid @RequestBody ChangeUpdateRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ChangeResponse> status(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) {
        return ResponseEntity.ok(service.updateStatus(id, req));
    }

    @PostMapping("/{id}/rollback")
    public ResponseEntity<ChangeResponse> rollbackAll(@PathVariable Long id, @Valid @RequestBody RollbackAllRequest req) {
        return ResponseEntity.ok(service.rollbackAll(id, req));
    }

    @PostMapping("/{id}/rollback-components")
    public ResponseEntity<ChangeResponse> rollbackComponents(@PathVariable Long id, @Valid @RequestBody RollbackComponentsRequest req) {
        return ResponseEntity.ok(service.rollbackComponents(id, req));
    }
}


