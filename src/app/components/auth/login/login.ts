import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LoginUsuario } from '../../../models/login-usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      cedula: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

onSubmit() {
  if (this.form.invalid) return;

  const cedula = this.form.get('cedula')?.value;
  const password = this.form.get('password')?.value;

  const loginDto = new LoginUsuario(cedula, password);
  this.auth.login(loginDto).subscribe({
    next: (response) => {     
      this.toastr.success('Sesión iniciada correctamente');
      this.router.navigate(['/dash']);
    },
    error: (err) => {
      console.error('Login error details:', err);
      if (err.error && err.error.message) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error('Credenciales inválidas');
      }
    }
  });
}
}