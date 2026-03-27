package com.skillstorm.runner.services;

import com.skillstorm.runner.dto.RunDTO;
import com.skillstorm.runner.models.RunModel;
import com.skillstorm.runner.models.ShoeModel;
import com.skillstorm.runner.models.UserModel;
import com.skillstorm.runner.repositories.RunRepository;
import com.skillstorm.runner.repositories.ShoeRepository;
import com.skillstorm.runner.repositories.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RunService {

    private final RunRepository runRepository;
    private final ShoeRepository shoeRepository;
    private final UserRepository userRepository;

    public RunService(RunRepository runRepository, ShoeRepository shoeRepository, UserRepository userRepository) {
        this.runRepository = runRepository;
        this.shoeRepository = shoeRepository;
        this.userRepository = userRepository;
    }

    public List<RunDTO> getAllRuns(Long userId) {
        return runRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RunDTO getRunById(Long id) {
        return runRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Run not found: " + id));
    }

    @Transactional
    public RunDTO createRun(RunDTO dto, Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        RunModel run = new RunModel();
        // No setId() — PostgreSQL SERIAL handles auto-increment
        mapDtoToEntity(dto, run);

        // Calculate pace: duration (minutes) / distance (miles)
        BigDecimal pace = BigDecimal.valueOf(dto.getDuration())
                .divide(dto.getDistance(), 2, RoundingMode.HALF_UP);
        run.setPace(pace);
        run.setUser(user);

        // Update shoe total miles
        ShoeModel shoe = shoeRepository.findById(dto.getShoeId())
                .orElseThrow(() -> new RuntimeException("Shoe not found: " + dto.getShoeId()));
        shoe.setTotalMiles(shoe.getTotalMiles().add(dto.getDistance()));
        shoeRepository.save(shoe);

        // Link to shoe_runs junction table
        run.getShoes().add(shoe);
        return toDTO(runRepository.save(run));
    }

    @Transactional
    public RunDTO updateRun(Long id, RunDTO dto) {
        RunModel run = runRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Run not found: " + id));

        // Reverse old mileage from old shoe
        ShoeModel oldShoe = shoeRepository.findById(run.getShoeId())
                .orElseThrow(() -> new RuntimeException("Shoe not found: " + run.getShoeId()));
        oldShoe.setTotalMiles(
                oldShoe.getTotalMiles().subtract(run.getDistance()).max(BigDecimal.ZERO)
        );
        shoeRepository.save(oldShoe);

        mapDtoToEntity(dto, run);

        // Recalculate pace
        BigDecimal pace = BigDecimal.valueOf(dto.getDuration())
                .divide(dto.getDistance(), 2, RoundingMode.HALF_UP);
        run.setPace(pace);

        // Add mileage to new shoe
        ShoeModel newShoe = shoeRepository.findById(dto.getShoeId())
                .orElseThrow(() -> new RuntimeException("Shoe not found: " + dto.getShoeId()));
        newShoe.setTotalMiles(newShoe.getTotalMiles().add(dto.getDistance()));
        shoeRepository.save(newShoe);

        return toDTO(runRepository.save(run));
    }

    @Transactional
    public void deleteRun(Long id) {
        RunModel run = runRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Run not found: " + id));

        // Reverse mileage from shoe
        ShoeModel shoe = shoeRepository.findById(run.getShoeId())
                .orElseThrow(() -> new RuntimeException("Shoe not found: " + run.getShoeId()));
        shoe.setTotalMiles(
                shoe.getTotalMiles().subtract(run.getDistance()).max(BigDecimal.ZERO)
        );
        shoeRepository.save(shoe);

        runRepository.deleteById(id);
    }

    private void mapDtoToEntity(RunDTO dto, RunModel run) {
        run.setDate(dto.getDate());
        run.setDistance(dto.getDistance());
        run.setDuration(dto.getDuration());
        run.setShoeId(dto.getShoeId());
        run.setRoute(dto.getRoute());
        run.setNotes(dto.getNotes());
    }

    // Fix: was toDTO(RunDTO run) — should take RunModel
    public RunDTO toDTO(RunModel run) {
        return new RunDTO(
                run.getId(),
                run.getDate(),
                run.getDistance(),
                run.getDuration(),
                run.getShoeId(),
                run.getPace(),
                run.getRoute(),
                run.getNotes()
        );
    }
}