package com.skillstorm.runner.repositories;

import com.skillstorm.runner.models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByEmail(String email);

    Optional<UserModel> findByProviderAndProviderId(String provider, String providerId);

    boolean existsByEmail(String email);
}
