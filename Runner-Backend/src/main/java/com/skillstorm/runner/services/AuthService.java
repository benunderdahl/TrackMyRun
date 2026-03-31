package com.skillstorm.runner.services;

import com.skillstorm.runner.dto.AuthResponse;
import com.skillstorm.runner.dto.LoginRequest;
import com.skillstorm.runner.dto.RegisterRequest;
import com.skillstorm.runner.models.UserModel;
import com.skillstorm.runner.repositories.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        UserModel user = new UserModel();
        user.setEmail(request.getEmail());
        user.setName(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider("local");

        UserModel saved = userRepository.save(user);
        return new AuthResponse(saved.getId(), saved.getEmail(), saved.getName(), saved.getProvider());
    }

    public AuthResponse login(LoginRequest request) {
        UserModel user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // ADD THIS DEBUG LINE
        System.out.println("=== DB HASH: [" + user.getPassword() + "]");
        System.out.println("=== INPUT: [" + request.getPassword() + "]");
        System.out.println("=== MATCH: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getProvider());
    }

    public AuthResponse getUserByEmail(String email) {
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new AuthResponse(user.getId(), user.getEmail(), user.getName(), user.getProvider());
    }
}
