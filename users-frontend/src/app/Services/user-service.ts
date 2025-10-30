// Ing. Danny Carrera
// 2025
import { Injectable } from '@angular/core';
import { User } from '../Models/usuario';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users'; // URL del backend
  private authUrl = 'http://localhost:8080/api/auth'; // URL auth pública

  constructor(private http: HttpClient) { }

  // 🔹 Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // 🔹 Obtener un usuario por id
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Agregar un nuevo usuario
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // 🔹 Actualizar un usuario existente
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  // 🔹 Eliminar un usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Registro público sin JWT
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/register`, user);
  }
}
