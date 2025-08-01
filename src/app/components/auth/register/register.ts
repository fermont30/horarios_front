import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { RegisterUsuario } from '../../../models/register-usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
})
export class Register {
  form: FormGroup;
  apiUrl = environment.apiUrl + 'auth';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['user', Validators.required],
    });
  }


onSubmit() {
  if (this.form.invalid) return;

  const { nombres, apellidos, cedula, email, rol } = this.form.value;
  const dto = new RegisterUsuario(nombres, apellidos, cedula, email, rol);

  this.auth.register(dto).subscribe({
    next: () => {
      this.toastr.success('Usuario registrado correctamente');
      this.router.navigate(['/dash/usuarios']); // 👈 redirección aquí
    },
    error: () => this.toastr.error('Error al registrar usuario'),
  });
}

}
