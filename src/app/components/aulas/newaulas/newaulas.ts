import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Aula } from '../../../models/aula';
import { AulaService } from '../../../services/aula.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newaulas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newaulas.html',
  styleUrl: './newaulas.css'
})
export class Newaulas {
  form: FormGroup;
  id: number | null = null;
  jornadas = ['matutina', 'vespertina', 'nocturna'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private aulaService: AulaService,
    public router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      jornada: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.aulaService.getById(this.id).subscribe({
        next: (data) => {
          this.form.patchValue(data);
        },
        error: () => {
          Swal.fire('Error', 'No se pudo cargar el aula', 'error');
          this.router.navigate(['/dash/aulas']);
        }
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const aula: Aula = this.form.value;

    if (this.id) {
      this.aulaService.update(this.id, aula).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Aula actualizada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/dash/aulas']);
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar el aula',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      this.aulaService.create(aula).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Aula registrada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/dash/aulas']);
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al registrar el aula',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }
}