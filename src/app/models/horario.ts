export interface PeriodoAcademico {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  semestre: number;
}

export interface Docente {
  id: number;
  identificacion: string;
  tipoContrato: string;
  estado: string;
  horasMinimas: number;
  horasMaximas: number;
}

export interface Aula {
  id: number;
  nombre: string;
  codigo: string;
  capacidad: number;
  jornada: string;
}

export interface Bloque {
  id: number;
  numero: number;
  horaInicio: string;
  horaFin: string;
}

export interface Horario {
  id?: number;
  periodoAcademico: PeriodoAcademico;
  asignatura: Asignatura;
  docente: Docente;
  aula: Aula;
  bloque: Bloque;
  diaSemana: string;
  activo: boolean;
}