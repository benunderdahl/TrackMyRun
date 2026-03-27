package com.skillstorm.runner.services;

import com.skillstorm.runner.models.UserModel;
import com.skillstorm.runner.repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String providerId = oauthUser.getAttribute("sub"); // Google's unique user id

        // Find existing user or create new one
        Optional<UserModel> existing = userRepository.findByProviderAndProviderId("google", providerId);

        if (existing.isEmpty()) {
            // Check if email already exists (user registered locally before)
            UserModel user = userRepository.findByEmail(email).orElseGet(UserModel::new);
            user.setEmail(email);
            user.setName(name);
            user.setProvider("google");
            user.setProviderId(providerId);
            userRepository.save(user);
        }

        // Redirect to Angular app after successful Google login
        response.sendRedirect("http://localhost:4200/dashboard");
    }
}
