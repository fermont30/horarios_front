import { ChangeDetectorRef, Component } from '@angular/core';
import { Aula } from '../../models/aula';
import { ToastrService } from 'ngx-toastr';
import { AulaService } from '../../services/aula.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-aulas',
  imports: [CommonModule, RouterLink],
  templateUrl: './aulas.html',
  styleUrl: './aulas.css'
})
export class Aulas {
 aulas: Aula[] = [];
  loading = true;

  constructor(
    private aulaService: AulaService,
    public router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarAulas();
  }

  cargarAulas() {
    this.loading = true;
    this.aulaService.getAll().subscribe({
      next: (data) => {
        this.aulas = data;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.toastr.error('Error al cargar aulas');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

 eliminarAula(id: number) {
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
        this.aulaService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              '¡Eliminado!',
              'El aula ha sido eliminada.',
              'success'
            );
            this.cargarAulas();
          },
          error: () => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el aula',
              'error'
            );
          }
        });
      }
    });
  }
}
