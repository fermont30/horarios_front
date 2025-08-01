// horario-modal.ts - Versión corregida
import { Component, EventEmitter, Input, Output, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Bloque, Horario, PeriodoAcademico, Asignatura, Docente, Aula } from '../../../models/horario';
import { HorarioService } from '../../../services/horario.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horario-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './horario-modal.html',
  styleUrl: './horario-modal.css'
})
export class HorarioModal implements OnInit {
  @Input() dia!: string;
  @Input() bloque!: Bloque;
  @Input() horario: Horario | null = null;
  @Input() aula!: Aula;
  @Input() periodoSeleccionado!: PeriodoAcademico;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Horario>();

  form: FormGroup;
  asignaturas: Asignatura[] = [];
  docentes: Docente[] = [];
  loading = false;
  isDataLoaded = false;

  constructor(
    private fb: FormBuilder,
    private horarioService: HorarioService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      asignatura: [null, Validators.required],
      docente: [null, Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    console.log('Modal iniciado con:', {
      dia: this.dia,
      bloque: this.bloque,
      aula: this.aula,
      periodo: this.periodoSeleccionado,
      horario: this.horario
    });
    
    this.loadRelatedData();
  }

  loadRelatedData(): void {
    this.loading = true;
    
    Promise.all([
      this.horarioService.getAsignaturas().toPromise(),
      this.horarioService.getDocentes().toPromise()
    ]).then(([asignaturas, docentes]) => {
      this.asignaturas = asignaturas || [];
      this.docentes = docentes || [];
      this.isDataLoaded = true;
      
      // Solo después de cargar los datos, llenar el formulario
      if (this.horario) {
        // Usar setTimeout para evitar el error de ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.form.patchValue({
            asignatura: this.horario!.asignatura,
            docente: this.horario!.docente,
            activo: this.horario!.activo
          });
          this.cdr.detectChanges();
        });
      }
      
      this.loading = false;
      this.cdr.detectChanges();
    }).catch(error => {
      console.error('Error cargando datos:', error);
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;
    
    // Adaptar los datos al formato que espera tu API REST
    const horarioData = {
      idPeriodo: this.periodoSeleccionado.id,
      idAsignatura: formValue.asignatura.id,
      idDocente: formValue.docente.id,
      idAula: this.aula.id,
      idBloque: this.bloque.id,
      diaSemana: this.dia,
      activo: formValue.activo
    };

    console.log('Enviando datos:', horarioData);

    const operation = this.horario 
      ? this.horarioService.update(this.horario.id!, horarioData)
      : this.horarioService.create(horarioData);

    operation.subscribe({
      next: (horarioGuardado) => {
        this.toastr.success('Horario guardado correctamente');
        this.saved.emit(horarioGuardado);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        this.toastr.error('Error al guardar el horario');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDelete(): void {
    if (this.horario?.id && confirm('¿Está seguro de eliminar este horario?')) {
      this.loading = true;
      this.horarioService.delete(this.horario.id).subscribe({
        next: () => {
          this.toastr.success('Horario eliminado correctamente');
          this.saved.emit(this.horario!);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.toastr.error('Error al eliminar el horario');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}