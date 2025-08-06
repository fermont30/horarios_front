// components/docentes/docentes.component.ts
import { ChangeDetectorRef, Component } from '@angular/core';
import { Docente } from '../../models/docente';
import { ToastrService } from 'ngx-toastr';
import { DocenteService } from '../../services/docente.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docentes',
  imports: [CommonModule, RouterLink],
  templateUrl: './docentes.html',
  styleUrl: './docentes.css'
})
export class Docentes {
  docentes: Docente[] = [];
  loading = true;

  constructor(
    private docenteService: DocenteService,
    public router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDocentes();
  }

  cargarDocentes() {
    this.loading = true;
    this.docenteService.getAll().subscribe({
      next: (data) => {
        this.docentes = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.toastr.error('Error al cargar docentes');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarDocente(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.docenteService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'El docente ha sido eliminado.',
              'success'
            );
            this.cargarDocentes();
          },
          error: () => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el docente',
              'error'
            );
          }
        });
      }
    });
  }

  getNombreCompleto(docente: Docente): string {
    return `${docente.usuario.nombres} ${docente.usuario.apellidos}`;
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      case 'suspendido':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoContratoBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'tiempo_completo':
        return 'bg-blue-100 text-blue-800';
      case 'medio_tiempo':
        return 'bg-purple-100 text-purple-800';
      case 'catedra':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatTipoContrato(tipo: string): string {
    switch (tipo) {
      case 'tiempo_completo':
        return 'Tiempo Completo';
      case 'medio_tiempo':
        return 'Medio Tiempo';
      case 'catedra':
        return 'Cátedra';
      default:
        return tipo;
    }
  }
}