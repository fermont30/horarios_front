import { ChangeDetectorRef, Component } from '@angular/core';
import { Asignatura } from '../../models/asignatura';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AsignaturaService } from '../../services/asignatura.service';

@Component({
  selector: 'app-asignaturas',
  imports: [RouterLink],
  templateUrl: './asignaturas.html',
  styleUrl: './asignaturas.css'
})
export class Asignaturas {
asignaturas: Asignatura[] = [];
  loading = true;

  constructor(
    private asignaturaService: AsignaturaService,
    public router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarAsignaturas();
  }

  cargarAsignaturas() {
    this.loading = true;
    this.asignaturaService.getAll().subscribe({
      next: (data) => {
        this.asignaturas = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar las asignaturas', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarAsignatura(id: number) {
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
        this.asignaturaService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminada!',
              'La asignatura ha sido eliminada.',
              'success'
            );
            this.cargarAsignaturas();
          },
          error: () => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar la asignatura',
              'error'
            );
          }
        });
      }
    });
  }
}
