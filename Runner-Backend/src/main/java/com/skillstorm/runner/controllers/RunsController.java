package com.skillstorm.runner.controllers;

import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@RestController
public class RunsController {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String date;

    @Column(name="distance_miles")
    private float miles;

    @Column(name="duration_minutes")
    private float minutes;

    private String notes;

    private long runner_id;

}
