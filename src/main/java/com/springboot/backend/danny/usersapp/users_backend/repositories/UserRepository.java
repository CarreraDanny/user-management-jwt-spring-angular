package com.springboot.backend.danny.usersapp.users_backend.repositories;
import org.springframework.data.repository.CrudRepository;
import com.springboot.backend.danny.usersapp.users_backend.entities.User;

//Ing. Danny Carrera 
public interface UserRepository extends CrudRepository<User, Long> {
    java.util.Optional<User> findByUsername(String username);
    java.util.Optional<User> findByName(String name);
}
