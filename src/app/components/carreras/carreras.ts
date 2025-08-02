import { Component, ChangeDetectorRef } from '@angular/core';
import { Carrera } from '../../models/carrera';
import { ToastrService } from 'ngx-toastr';
import { CarreraService } from '../../services/carrera.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


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
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carreraService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminada!',
              'La carrera ha sido eliminada.',
              'success'
            );
            this.cargarCarreras();
          },
          error: () => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la carrera',
              'error'
            );
          }
        });
      }
    });
  }
}