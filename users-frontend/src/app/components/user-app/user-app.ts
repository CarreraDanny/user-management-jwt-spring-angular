import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user-service';
import { User } from '../../Models/usuario';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Navbar } from "../navbar/navbar";
@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, Navbar],
  templateUrl: './user-app.html',
  styleUrls: ['./user-app.css']
})
export class UserApp implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

   ngOnInit(): void {
    this.loadUsers(); // <<-- cambio: antes hacías this.users = userService.getUsers()
  }
  // 🔹 Método para cargar usuarios desde el backend
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data; // <<-- aquí se asignan los datos reales del backend
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  onUserAdded(user: User): void {
  this.userService.getUsers().subscribe({
    next: (data: User[]) => this.users = data, // ✅ actualiza la lista correctamente
    error: (err) => console.error('Error al actualizar la lista de usuarios:', err)
  });
}

}
