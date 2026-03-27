package com.skillstorm.runner.dto;
import java.math.BigDecimal;
import java.time.LocalDate;

public class RunDTO {
    private Long id;
    private LocalDate date;
    private BigDecimal distance;
    private Integer duration;
    private Long shoeId;
    private BigDecimal pace;
    private String route;
    private String notes;

    public RunDTO() {
    }

    public RunDTO(Long id, LocalDate date, BigDecimal distance, Integer duration,
            Long shoeId, BigDecimal pace, String route, String notes) {
        this.id = id;
        this.date = date;
        this.distance = distance;
        this.duration = duration;
        this.shoeId = shoeId;
        this.pace = pace;
        this.route = route;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getDistance() {
        return distance;
    }

    public void setDistance(BigDecimal distance) {
        this.distance = distance;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Long getShoeId() {
        return shoeId;
    }

    public void setShoeId(Long shoeId) {
        this.shoeId = shoeId;
    }

    public BigDecimal getPace() {
        return pace;
    }

    public void setPace(BigDecimal pace) {
        this.pace = pace;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
