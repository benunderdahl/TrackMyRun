package com.skillstorm.runner.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.skillstorm.runner.models.ShoesModel;

@Repository
public interface ShoesRepository extends JpaRepository<ShoesModel, Long>{

}
