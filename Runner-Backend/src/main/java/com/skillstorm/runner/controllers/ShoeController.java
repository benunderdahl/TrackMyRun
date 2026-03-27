package com.skillstorm.runner.controllers;
import com.skillstorm.runner.dto.ShoeDTO;
import com.skillstorm.runner.services.AuthService;
import com.skillstorm.runner.services.ShoeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shoes")
public class ShoeController {

    private final ShoeService shoeService;
    private final AuthService authService;

    public ShoeController(ShoeService shoeService, AuthService authService) {
        this.shoeService = shoeService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<ShoeDTO>> getAllShoes(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = authService.getUserByEmail(userDetails.getUsername()).getId();
        return ResponseEntity.ok(shoeService.getAllShoes(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShoeDTO> getShoeById(@PathVariable Long id) {
        return ResponseEntity.ok(shoeService.getShoeById(id));
    }

    @PostMapping
    public ResponseEntity<ShoeDTO> createShoe(@RequestBody ShoeDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = authService.getUserByEmail(userDetails.getUsername()).getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(shoeService.createShoe(dto, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShoeDTO> updateShoe(@PathVariable Long id, @RequestBody ShoeDTO dto) {
        return ResponseEntity.ok(shoeService.updateShoe(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShoe(@PathVariable Long id) {
        shoeService.deleteShoe(id);
        return ResponseEntity.noContent().build();
    }
}
