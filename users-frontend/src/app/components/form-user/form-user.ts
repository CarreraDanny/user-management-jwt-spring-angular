import { Component,EventEmitter,Output, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../Services/user-service';
import { User } from '../../Models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'form-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-user.html',
  styleUrls: ['./form-user.css']
})
export class FormUser {
  @Input() userId?: number;                  // dY"1 Para editar un usuario
  @Output() userAdded = new EventEmitter<User>();
  @Output() userUpdated = new EventEmitter<User>();


  user: User = new User();
  // Errores de validación devueltos por el backend (campo -> mensaje)
  serverErrors: { [key: string]: string } = {};

  constructor(private userService: UserService) { }

  addUser(): void {
    if (this.user.name && this.user.lastName && this.user.email && this.user.username && this.user.password) {
      this.userService.registerUser(this.user).subscribe({
        next: (created: User) => {
          this.userAdded.emit(created);
          this.serverErrors = {}; // limpiar errores del backend en éxito
          Swal.fire({
            icon: 'success',
            title: 'Usuario agregado',
            text: `El usuario ${created.name} ha sido creado correctamente.`,
            timer: 1500,
            showConfirmButton: false
          });
          this.user = new User();
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
          // Si el backend envía errores de validación (400) con { errors: {campo: mensaje} }
          const errors = err?.error?.errors;
          if (err?.status === 400 && errors) {
            this.serverErrors = errors;
            const list = Object.values(errors).join('\n');
            Swal.fire({
              icon: 'error',
              title: 'Validación',
              text: 'Revisa los campos marcados.\n' + list
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al guardar',
              text: 'No se pudo guardar el usuario en el servidor.'
            });
          }
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos'
      });
    }
  }

  // Limpiar error de un campo cuando el usuario lo modifica
  clearServerError(field: string) {
    if (this.serverErrors[field]) {
      delete this.serverErrors[field];
      this.serverErrors = { ...this.serverErrors };
    }
  }
}
