package com.skillstorm.runner.repositories;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.skillstorm.runner.models.ShoeModel;

@Repository
public interface ShoeRepository extends JpaRepository<ShoeModel, Long>{
     List<ShoeModel> findByUserId(Long userId);
}
