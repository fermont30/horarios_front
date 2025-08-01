import { Component, ChangeDetectorRef } from '@angular/core';
import { Carrera } from '../../models/carrera';
import { ToastrService } from 'ngx-toastr';
import { CarreraService } from '../../services/carrera.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carreras.html',
  styleUrl: './carreras.css'
})
export class Carreras {
  carreras: Carrera[] = [];
  loading = true;

  constructor(
    private carreraService: CarreraService,
    public router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarCarreras();
  }

  cargarCarreras() {
    this.loading = true;
    this.carreraService.getAll().subscribe({
      next: (data) => {
        this.carreras = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.toastr.error('Error al cargar carreras');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarCarrera(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta carrera?')) {
      this.carreraService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Carrera eliminada');
          this.cargarCarreras();
        },
        error: () => this.toastr.error('Error al eliminar carrera'),
      });
    }
  }
}