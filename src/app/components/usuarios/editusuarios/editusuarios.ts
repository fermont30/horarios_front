// pages/usuarios/editusuarios/editusuarios.ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UsuarioUpdate } from '../../../models/usuario';

@Component({
  selector: 'app-editusuarios',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editusuarios.html',
  styleUrl: './editusuarios.css'
})
export class Editusuarios {
  form: FormGroup;
  id: number | null = null;
  rolesDisponibles = ['user', 'staff'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usuarioService: AuthService,
    public router: Router
  ) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.usuarioService.getById(this.id).subscribe({
        next: (usuario) => {
          console.log('Usuario recibido:', usuario); // Para debug
          
          // Convertir roles de objetos a array de strings
          const rolesStrings = usuario.roles.map(rol => rol.rolNombre);
          
          this.form.patchValue({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            cedula: usuario.cedula,
            email: usuario.email,
            roles: rolesStrings
          });
          
          console.log('Roles convertidos:', rolesStrings); // Para debug
        },
        error: (error) => {
          console.error('Error al cargar usuario:', error);
          Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
          this.router.navigate(['/dash/usuarios']);
        }
      });
    }
  }

  onChangeRol(event: Event) {
    const input = event.target as HTMLInputElement;
    const roles = [...(this.form.value.roles || [])];

    if (input.checked) {
      if (!roles.includes(input.value)) {
        roles.push(input.value);
      }
    } else {
      const index = roles.indexOf(input.value);
      if (index >= 0) {
        roles.splice(index, 1);
      }
    }

    this.form.patchValue({ roles });
    this.form.get('roles')?.updateValueAndValidity();
  }

  // Método para verificar si un rol está seleccionado
  isRolSelected(rol: string): boolean {
    const roles = this.form.value.roles || [];
    return roles.includes(rol);
  }

  onSubmit() {
    if (this.form.invalid || !this.id) {
      console.log('Formulario inválido o ID faltante');
      return;
    }

    const usuarioUpdate: UsuarioUpdate = {
      nombres: this.form.value.nombres,
      apellidos: this.form.value.apellidos,
      cedula: this.form.value.cedula,
      email: this.form.value.email,
      roles: this.form.value.roles
    };

    console.log('Datos a enviar:', usuarioUpdate); // Para debug

    this.usuarioService.update(this.id, usuarioUpdate).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        Swal.fire('¡Éxito!', 'Usuario actualizado correctamente', 'success').then(() => {
          this.router.navigate(['/dash/usuarios']);
        });
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        Swal.fire('Error', 'Ocurrió un error al actualizar el usuario', 'error');
      }
    });
  }
}
