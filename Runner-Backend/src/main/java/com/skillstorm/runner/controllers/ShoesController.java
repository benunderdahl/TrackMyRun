package com.skillstorm.runner.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;





@RestController
@RequestMapping("/api/shoes")
public class ShoesController {
    
    @GetMapping
    public String getShoes() {
        return new String();
    }

    @PostMapping
    public String postShoes() {
        return new String();   
    }

    @PutMapping("/{id}")
    public String putShoes(@RequestParam String id) {
        return new String();
    }
    
    @DeleteMapping("/{id}")
    public String deleteShoes(@RequestParam int id) {
        return new String();
    }
}
