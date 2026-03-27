package com.skillstorm.runner.dto;

public class AuthResponse {
    private Long id;
    private String email;
    private String name;
    private String provider;

    public AuthResponse(Long id, String email, String name, String provider) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.provider = provider;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getProvider() {
        return provider;
    }
}
