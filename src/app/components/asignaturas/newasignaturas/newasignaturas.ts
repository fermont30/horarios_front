import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Asignatura } from '../../../models/asignatura';
import { Carrera } from '../../../models/carrera';
import { AsignaturaService } from '../../../services/asignatura.service';
import { CarreraService } from '../../../services/carrera.service';

@Component({
  selector: 'app-newasignaturas',
  imports: [ReactiveFormsModule],
  templateUrl: './newasignaturas.html',
  styleUrl: './newasignaturas.css'
})
export class Newasignaturas {
form: FormGroup;
  id: number | null = null;
  carreras: Carrera[] = [];
  semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private asignaturaService: AsignaturaService,
    private carreraService: CarreraService,
    public router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      creditos: ['', [Validators.required, Validators.min(1)]],
      semestre: ['', Validators.required],
      idCarrera: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCarreras();
    
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.asignaturaService.getById(this.id).subscribe({
        next: (data) => {
          this.form.patchValue(data);
          // Asegurarse de que idCarrera se establece correctamente
          this.form.get('idCarrera')?.setValue(data.idCarrera);
        },
        error: () => {
          Swal.fire('Error', 'No se pudo cargar la asignatura', 'error');
          this.router.navigate(['/dash/asignaturas']);
        }
      });
    }
  }

  cargarCarreras() {
    this.carreraService.getAll().subscribe({
      next: (data) => {
        this.carreras = data;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las carreras', 'error');
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const asignatura: Asignatura = this.form.value;

    if (this.id) {
      this.asignaturaService.update(this.id, asignatura).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Asignatura actualizada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/dash/asignaturas']);
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar la asignatura',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      this.asignaturaService.create(asignatura).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Asignatura registrada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/dash/asignaturas']);
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al registrar la asignatura',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }
}
