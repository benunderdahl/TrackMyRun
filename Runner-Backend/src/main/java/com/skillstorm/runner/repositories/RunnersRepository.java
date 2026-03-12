package com.skillstorm.runner.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.skillstorm.runner.models.RunnersModel;

@Repository
public interface RunnersRepository extends JpaRepository<RunnersModel, Long>{

}
