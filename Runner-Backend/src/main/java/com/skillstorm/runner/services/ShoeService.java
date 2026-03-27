package com.skillstorm.runner.services;

import com.skillstorm.runner.dto.ShoeDTO;
import com.skillstorm.runner.models.ShoeModel;
import com.skillstorm.runner.repositories.ShoeRepository;
import com.skillstorm.runner.repositories.UserRepository;
import com.skillstorm.runner.models.UserModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShoeService {

    private final ShoeRepository shoeRepository;
    private final UserRepository userRepository;

    public ShoeService(ShoeRepository shoeRepository, UserRepository userRepository) {
        this.shoeRepository = shoeRepository;
        this.userRepository = userRepository;
    }

    public List<ShoeDTO> getAllShoes(Long userId) {
        return shoeRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ShoeDTO getShoeById(Long id) {
        return shoeRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Shoe not found: " + id));
    }

    public ShoeDTO createShoe(ShoeDTO dto, Long userId) {
        UserModel user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        ShoeModel shoe = new ShoeModel();
        mapDtoToEntity(dto, shoe);
        shoe.setUser(user);
        return toDTO(shoeRepository.save(shoe));
    }

    public ShoeDTO updateShoe(Long id, ShoeDTO dto) {
        ShoeModel shoe = shoeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shoe not found: " + id));
        mapDtoToEntity(dto, shoe);
        return toDTO(shoeRepository.save(shoe));
    }

    public void deleteShoe(Long id) {
        shoeRepository.deleteById(id);
    }

    private void mapDtoToEntity(ShoeDTO dto, ShoeModel shoe) {
        shoe.setBrand(dto.getBrand());
        shoe.setModel(dto.getModel());
        shoe.setPurchaseDate(dto.getPurchaseDate());
        shoe.setColor(dto.getColor());
        shoe.setNotes(dto.getNotes());
        if (dto.getTotalMiles() != null) {
            shoe.setTotalMiles(dto.getTotalMiles());
        }
    }

    public ShoeDTO toDTO(ShoeModel shoe) {
        return new ShoeDTO(
                shoe.getId(),
                shoe.getBrand(),
                shoe.getModel(),
                shoe.getPurchaseDate(),
                shoe.getTotalMiles(),
                shoe.getColor(),
                shoe.getNotes()
        );
    }
}