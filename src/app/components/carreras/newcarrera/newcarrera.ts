import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Carrera } from '../../../models/carrera';
import { CarreraService } from '../../../services/carrera.service';

@Component({
  selector: 'app-newcarrera',
  imports: [ReactiveFormsModule],
  templateUrl: './newcarrera.html',
  styleUrl: './newcarrera.css'
})
export class Newcarrera {
form: FormGroup;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private carreraService: CarreraService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.carreraService.getById(this.id).subscribe((data) => {
        this.form.patchValue(data);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const carrera: Carrera = this.form.value;

    if (this.id) {
      this.carreraService.update(this.id, carrera).subscribe({
        next: () => {
          this.toastr.success('Carrera actualizada');
          this.router.navigate(['/dash/carreras']);
        },
        error: () => this.toastr.error('Error al actualizar carrera'),
      });
    } else {
      this.carreraService.create(carrera).subscribe({
        next: () => {
          this.toastr.success('Carrera registrada');
          this.router.navigate(['/dash/carreras']);
        },
        error: () => this.toastr.error('Error al registrar carrera'),
      });
    }
  }
}
