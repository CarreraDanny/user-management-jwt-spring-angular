-- Ing. Danny Carrera
-- Base de datos para aplicación Angular + Spring Boot (users_db)

-- Crear base de datos
CREATE DATABASE users_db;
USE users_db;

-- ======================================
-- TABLA: users
-- ======================================
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- ======================================
-- TABLA: roles
-- ======================================
CREATE TABLE roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- ======================================
-- TABLA: user_roles (relación muchos a muchos)
-- ======================================
CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ======================================
-- DATOS DE PRUEBA
-- ======================================
INSERT INTO roles (name) VALUES ('ROLE_ADMIN'), ('ROLE_USER');

INSERT INTO users (name, lastname, email, username, password) VALUES
('Admin', 'System', 'admin@example.com', 'admin', '12345'),
('Danny', 'Carrera', 'danny@example.com', 'dannyc', '12345');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Admin -> ROLE_ADMIN
(2, 2); -- Danny -> ROLE_USER
