package com.skillstorm.runner.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "runs")
public class RunModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private UserModel user;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal distance;

    @Column(nullable = false)
    private Integer duration; // in minutes

    @Column(name = "shoe_id", nullable = false)
    private Long shoeId;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal pace; // minutes per mile

    @Column(length = 255)
    private String route;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "shoe_runs", joinColumns = @JoinColumn(name = "run_id"), inverseJoinColumns = @JoinColumn(name = "shoe_id"))
    private Set<ShoeModel> shoes = new HashSet<>();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters & Setters
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Set<ShoeModel> getShoes() {
        return shoes;
    }

    public void setShoes(Set<ShoeModel> shoes) {
        this.shoes = shoes;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }
}
