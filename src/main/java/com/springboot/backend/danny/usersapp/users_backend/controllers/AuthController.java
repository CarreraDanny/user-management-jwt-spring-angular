package com.springboot.backend.danny.usersapp.users_backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.backend.danny.usersapp.users_backend.dto.UserRequest;
import com.springboot.backend.danny.usersapp.users_backend.entities.User;
import com.springboot.backend.danny.usersapp.users_backend.services.UserService;

import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;

// Registro público sin JWT
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody UserRequest payload) {
        User user = new User();
        user.setId(null);
        user.setName(payload.getName());
        user.setLastname(payload.getLastName());
        user.setEmail(payload.getEmail());
        user.setUsername(payload.getUsername());
        user.setPassword(passwordEncoder.encode(payload.getPassword()));

        User saved = userService.save(user);
        // Evitar retornar el hash de contraseña
        saved.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}

