package com.skillstorm.runner.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.skillstorm.runner.models.RunsModel;

@Repository
public interface RunsRepository extends JpaRepository<RunsModel, Long>{

}
