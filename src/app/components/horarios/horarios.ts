// horarios.ts - Versión corregida
import { ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Aula, Bloque, Horario, PeriodoAcademico } from '../../models/horario';
import { HorarioService } from '../../services/horario.service';
import { HorarioModal } from './horario-modal/horario-modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-horarios',
  imports: [HorarioModal, CommonModule, FormsModule],
  templateUrl: './horarios.html',
  styleUrl: './horarios.css'
})
export class Horarios {
  diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  bloques: Bloque[] = [];
  horarios: Horario[] = [];
  aulas: Aula[] = []; 
  periodosAcademicos: PeriodoAcademico[] = [];
  periodoSeleccionado: PeriodoAcademico | null = null;
  aulaSeleccionada: Aula | null = null;
  loading = true;
  modalOpen = false;
  currentDia = '';
  currentBloque: Bloque | null = null;
  selectedHorario: Horario | null = null; 

  constructor(
    private horarioService: HorarioService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    try {
      this.loading = true;
      
      // Cargar datos en paralelo
      const [periodos, bloques, horarios] = await Promise.all([
        this.horarioService.getPeriodos().toPromise(),
        this.horarioService.getBloques().toPromise(),
        this.horarioService.getAll().toPromise()
      ]);

      this.periodosAcademicos = periodos || [];
      this.bloques = (bloques || []).sort((a, b) => a.numero - b.numero);
      this.horarios = horarios || [];
      
      // Seleccionar período activo por defecto
      this.periodoSeleccionado = this.periodosAcademicos.find(p => p.activo) || null;
      
      // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.updateAulasDisponibles();
        this.cdr.detectChanges();
      });
      
    } catch (error) {
      this.toastr.error('Error al cargar datos iniciales');
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  onPeriodoChange(): void {
    // Usar setTimeout para evitar cambios durante el ciclo de detección
    setTimeout(() => {
      if (this.periodoSeleccionado) {
        this.aulaSeleccionada = null; // Resetear aula seleccionada
        this.updateAulasDisponibles();
        this.cdr.detectChanges();
      }
    });
  }

  onAulaChange(): void {
    // Usar setTimeout para evitar cambios durante el ciclo de detección
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  updateAulasDisponibles(): void {
    if (!this.periodoSeleccionado) {
      this.aulas = [];
      return;
    }

    // Filtrar aulas que tienen horarios en el período seleccionado
    const aulasEnPeriodo = new Map<number, Aula>();
    
    this.horarios.forEach(horario => {
      if (horario.periodoAcademico?.id === this.periodoSeleccionado?.id && horario.aula) {
        if (!aulasEnPeriodo.has(horario.aula.id)) {
          aulasEnPeriodo.set(horario.aula.id, horario.aula);
        }
      }
    });

    const aulasAnterior = this.aulas.map(a => a.id);
    this.aulas = Array.from(aulasEnPeriodo.values());
    
    // Si el aula seleccionada ya no está disponible, resetearla
    if (this.aulaSeleccionada && !this.aulas.some(a => a.id === this.aulaSeleccionada?.id)) {
      this.aulaSeleccionada = null;
    }
  }

  getHorariosFiltrados(): Horario[] {
    if (!this.periodoSeleccionado) return [];
    
    let horariosFiltrados = this.horarios.filter(h => 
      h.periodoAcademico?.id === this.periodoSeleccionado?.id
    );

    if (this.aulaSeleccionada) {
      horariosFiltrados = horariosFiltrados.filter(h => 
        h.aula?.id === this.aulaSeleccionada?.id
      );
    }

    return horariosFiltrados;
  }

  getHorario(dia: string, bloqueId: number): Horario | undefined {
    const horariosFiltrados = this.getHorariosFiltrados();
    return horariosFiltrados.find(h => 
      h.diaSemana.toLowerCase() === dia.toLowerCase() && 
      h.bloque.id === bloqueId
    );
  }

  openModal(dia: string, bloque: Bloque): void {
    console.log('Intentando abrir modal para:', dia, bloque);

    if (!this.periodoSeleccionado || !this.aulaSeleccionada) {
      this.toastr.warning('Selecciona período y aula primero');
      return;
    }

    this.currentDia = dia;
    this.currentBloque = bloque;
    this.selectedHorario = this.getHorario(dia, bloque.id) || null;

    // Usar setTimeout para evitar cambios durante el ciclo de detección
    setTimeout(() => {
      this.modalOpen = true;
      this.cdr.detectChanges();
    });
  }

  closeModal(): void {
    setTimeout(() => {
      this.modalOpen = false;
      this.cdr.detectChanges();
    });
  }

  onHorarioSaved(horario: Horario): void {
    // Cerrar el modal primero
    this.closeModal();
    
    // Recargar todos los horarios desde el servidor
    this.horarioService.getAll().subscribe({
      next: (horariosActualizados) => {
        this.horarios = horariosActualizados || [];
        
        // Mantener las selecciones actuales
        const periodoActual = this.periodoSeleccionado;
        const aulaActual = this.aulaSeleccionada;
        
        // Actualizar aulas disponibles
        this.updateAulasDisponibles();
        
        // Restaurar las selecciones si siguen siendo válidas
        if (periodoActual && this.periodosAcademicos.some(p => p.id === periodoActual.id)) {
          this.periodoSeleccionado = periodoActual;
        }
        
        if (aulaActual && this.aulas.some(a => a.id === aulaActual.id)) {
          this.aulaSeleccionada = aulaActual;
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al recargar horarios:', error);
        this.toastr.error('Error al actualizar la vista');
      }
    });
  }
}