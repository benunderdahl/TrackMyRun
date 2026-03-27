package com.skillstorm.runner.dto;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ShoeDTO {
    private Long id;
    private String brand;
    private String model;
    private LocalDate purchaseDate;
    private BigDecimal totalMiles;
    private String color;
    private String notes;

    public ShoeDTO() {
    }

    public ShoeDTO(Long id, String brand, String model, LocalDate purchaseDate,
            BigDecimal totalMiles, String color, String notes) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.purchaseDate = purchaseDate;
        this.totalMiles = totalMiles;
        this.color = color;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public BigDecimal getTotalMiles() {
        return totalMiles;
    }

    public void setTotalMiles(BigDecimal totalMiles) {
        this.totalMiles = totalMiles;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
