import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { User } from '../../Models/usuario';
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent {
  users: User[] = [];
  allUsers: User[] = [];
  editingUser: User | null = null;

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadUsers();
    this.route.queryParams.subscribe(params => {
      const q = (params['q'] || '').toLowerCase().trim();
      if (q) {
        this.users = this.allUsers.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)
        );
      } else {
        this.users = [...this.allUsers];
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.allUsers = data;
        this.users = [...this.allUsers];
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'No podras revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#7f8c8d',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error al eliminar usuario:', err)
        });
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      }
    });
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
    Swal.fire({
      icon: 'info',
      title: 'Modo edicion',
      text: `Estas editando al usuario ${user.name}`,
      timer: 1000,
      showConfirmButton: false
    });
  }

  saveUser(): void {
    if (this.editingUser) {
      this.userService.updateUser(this.editingUser).subscribe({
        next: () => {
          this.loadUsers();
          Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: `El usuario ${this.editingUser!.name} ha sido actualizado.`,
            timer: 1500,
            showConfirmButton: false
          });
          this.editingUser = null;
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
          const errors = (err && err.error && err.error.errors) || null;
          if (err && err.status === 400 && errors) {
            const list = Object.values(errors as Record<string, string>).join('\n');
            Swal.fire({ icon: 'error', title: 'Validación', text: 'Revisa los datos ingresados.\n' + list });
          } else if (err && err.status === 404) {
            Swal.fire({ icon: 'warning', title: 'No encontrado', text: 'El usuario ya no existe.' });
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el usuario.' });
          }
        }
      });
    }
  }
}

