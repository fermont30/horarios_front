import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Asignatura, Docente, DocenteCreate, Usuario } from "../../../models/docente";
import { DocenteService } from "../../../services/docente.service";

@Component({
  selector: 'app-newdocente',
  templateUrl: './newdocente.html',
  styleUrls: ['./newdocente.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class Newdocente {
  form: FormGroup;
  id: number | null = null;
  usuarios: Usuario[] = [];
  asignaturas: Asignatura[] = [];
  
  tiposContrato = [
    { value: 'tiempo_completo', label: 'Tiempo Completo' },
    { value: 'medio_tiempo', label: 'Medio Tiempo' },
    { value: 'catedra', label: 'Cátedra' }
  ];
  
  estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'suspendido', label: 'Suspendido' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private docenteService: DocenteService,
    public router: Router
  ) {
    this.form = this.fb.group({
      identificacion: ['', Validators.required],
      tipoContrato: ['', Validators.required],
      estado: ['', Validators.required],
      horasMinimas: ['', [Validators.required, Validators.min(1)]],
      horasMaximas: ['', [Validators.required, Validators.min(1)]],
      idUsuario: ['', Validators.required],
      asignaturasIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || null;
    
    // Cargamos usuarios y asignaturas siempre
    this.cargarUsuarios();
    this.cargarAsignaturas();
    
    // Si es edición, cargamos el docente
    if (this.id) {
      this.cargarDocente();
    }
  }

  cargarUsuarios() {
    this.docenteService.getUsuariosDisponibles().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', this.usuarios); // Para debug
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  cargarAsignaturas() {
    this.docenteService.getAsignaturas().subscribe({
      next: (data) => {
        this.asignaturas = data;
        console.log('Asignaturas cargadas:', this.asignaturas); // Para debug
      },
      error: (error) => {
        console.error('Error cargando asignaturas:', error);
        Swal.fire('Error', 'No se pudieron cargar las asignaturas', 'error');
      }
    });
  }

  cargarDocente() {
    this.docenteService.getById(this.id!).subscribe({
      next: (data: Docente) => {
        console.log('Docente cargado:', data); // Para debug
        
        // Aseguramos que los usuarios estén cargados antes de establecer valores
        const setFormValues = () => {
          this.form.patchValue({
            identificacion: data.identificacion,
            tipoContrato: data.tipoContrato,
            estado: data.estado,
            horasMinimas: data.horasMinimas,
            horasMaximas: data.horasMaximas,
            idUsuario: data.usuario.id,
            asignaturasIds: data.asignaturas.map(a => a.id)
          });
        };

        // Si los usuarios ya están cargados, establecemos valores inmediatamente
        if (this.usuarios.length > 0) {
          setFormValues();
        } else {
          // Si no, esperamos un poco y reintentamos
          setTimeout(() => setFormValues(), 500);
        }
      },
      error: (error) => {
        console.error('Error cargando docente:', error);
        Swal.fire('Error', 'No se pudo cargar el docente', 'error');
        this.router.navigate(['/dash/docentes']);
      }
    });
  }

  onAsignaturaChange(asignaturaId: number, event: any) {
    const asignaturasIds = this.form.get('asignaturasIds')?.value || [];
    
    if (event.target.checked) {
      this.form.patchValue({
        asignaturasIds: [...asignaturasIds, asignaturaId]
      });
    } else {
      this.form.patchValue({
        asignaturasIds: asignaturasIds.filter((id: number) => id !== asignaturaId)
      });
    }
  }

  isAsignaturaSelected(asignaturaId: number): boolean {
    const asignaturasIds = this.form.get('asignaturasIds')?.value || [];
    return asignaturasIds.includes(asignaturaId);
  }

  getNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombres} ${usuario.apellidos}`;
  }

  getUsuarioActual(): Usuario | null {
    const idUsuario = this.form.get('idUsuario')?.value;
    if (!idUsuario) return null;
    return this.usuarios.find(u => u.id === idUsuario) || null;
  }

  onSubmit() {
    if (this.form.invalid) return;

    const docente: DocenteCreate = this.form.value;

    if (this.id) {
      this.docenteService.update(this.id, docente).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Docente actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/dash/docentes']);
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al actualizar el docente',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      this.docenteService.create(docente).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Docente registrado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/dash/docentes']);
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al registrar el docente',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }
}