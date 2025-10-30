package com.springboot.backend.danny.usersapp.users_backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid; // <- VALIDACIÓN: activa validación del DTO

import com.springboot.backend.danny.usersapp.users_backend.dto.UserRequest; // <- DTO validado
import com.springboot.backend.danny.usersapp.users_backend.entities.User;
import com.springboot.backend.danny.usersapp.users_backend.services.UserService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Listar todos los usuarios
    @GetMapping
    public List<User> list() {
        return userService.findAll();
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public Optional<User> show(@PathVariable Long id) {
        return userService.findById(id);
    }

    // Crear nuevo usuario
    @PostMapping
    public User create(@Valid @RequestBody UserRequest payload) {
        // VALIDACIÓN: @Valid asegura que el JSON cumpla las reglas del DTO
        // Si hay errores, Spring devuelve 400 antes de ejecutar el cuerpo

        // Mapeo seguro del DTO a entidad (id siempre null para INSERT)
        User user = new User();
        user.setId(null);
        user.setName(payload.getName());
        user.setLastname(payload.getLastName());
        user.setEmail(payload.getEmail());
        user.setUsername(payload.getUsername());
        user.setPassword(passwordEncoder.encode(payload.getPassword()));
        return userService.save(user);
    }

    // Actualizar usuario existente
    @PutMapping("/{id}")
    public User update(@Valid @RequestBody UserRequest payload, @PathVariable Long id) {
        // VALIDACIÓN: @Valid en PUT también valida el JSON de entrada
        Optional<User> optionalUser = userService.findById(id);
        if (optionalUser.isPresent()) {
            User userDB = optionalUser.get();
            // Aplicar cambios del DTO validado
            userDB.setName(payload.getName());
            userDB.setLastname(payload.getLastName());
            userDB.setEmail(payload.getEmail());
            userDB.setUsername(payload.getUsername());
            if (payload.getPassword() != null && !payload.getPassword().isBlank()) {
                userDB.setPassword(passwordEncoder.encode(payload.getPassword()));
            }
            return userService.save(userDB);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
    }

    // Eliminar usuario por ID
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteById(id);
    }
}
