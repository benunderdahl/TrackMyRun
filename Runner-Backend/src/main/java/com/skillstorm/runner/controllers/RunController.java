package com.skillstorm.runner.controllers;
import com.skillstorm.runner.dto.RunDTO;
import com.skillstorm.runner.services.AuthService;
import com.skillstorm.runner.services.RunService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/runs")
public class RunController {

    private final RunService runService;
    private final AuthService authService;

    public RunController(RunService runService, AuthService authService) {
        this.runService = runService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<RunDTO>> getAllRuns(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = authService.getUserByEmail(userDetails.getUsername()).getId();
        return ResponseEntity.ok(runService.getAllRuns(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RunDTO> getRunById(@PathVariable Long id) {
        return ResponseEntity.ok(runService.getRunById(id));
    }

    @PostMapping
    public ResponseEntity<RunDTO> createRun(@RequestBody RunDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = authService.getUserByEmail(userDetails.getUsername()).getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(runService.createRun(dto, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RunDTO> updateRun(@PathVariable Long id, @RequestBody RunDTO dto) {
        return ResponseEntity.ok(runService.updateRun(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRun(@PathVariable Long id) {
        runService.deleteRun(id);
        return ResponseEntity.noContent().build();
    }
}
