package com.skillstorm.runner.repositories;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.skillstorm.runner.models.RunModel;

@Repository
public interface RunRepository extends JpaRepository<RunModel, Long>{
    List<RunModel> findByShoeIdOrderByDateDesc(Long shoeId);
    List<RunModel> findAllByOrderByDateDesc();
    List<RunModel> findByUserIdOrderByDateDesc(Long userId);
}
