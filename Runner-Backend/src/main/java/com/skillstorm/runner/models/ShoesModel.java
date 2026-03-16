package com.skillstorm.runner.models;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ShoesModel {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    @Column(name="brand")
    private String brand;

    @Column(name="usable")
    private String retired;

    @Column(name="purchase_date")
    private String date;

    @Column(name="max_miles")
    private String miles;
}
