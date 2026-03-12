package com.skillstorm.runner.controllers;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;





@RestController
@RequestMapping("/api/runners")
public class RunnersController {
    @GetMapping()
    public String getRunners() {
        return new String();
    }

    @PostMapping()
    public String postRunner() {
        return new String();
    }

    @PutMapping("/{id}")
    public String putRunner(@PathVariable String id) {
        return new String();
    }

    @DeleteMapping("/{id}")
    public String deleteRunner(@PathVariable String id) {
        return new String();
    }
}   
