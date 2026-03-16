package com.skillstorm.runner.models;

import java.sql.Date;

import com.skillstorm.runner.services.RunsService;

import jakarta.persistence.Entity;

@Entity
public class RunsModel {

    private RunsService runService;
    public RunsModel(RunsService runservice) {
        this.runService = runservice;
    }

    private long id;
    private Date date;
    private float distance;
    private float duration;
    private String notes;

    // FK
    private long runner_id;
}
