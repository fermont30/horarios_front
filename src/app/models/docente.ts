export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  isActive: boolean;
  roles: Array<{
    id: number;
    rolNombre: string;
  }>;
}

export interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  semestre: number;
  carrera: {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
  };
}

export interface Disponibilidad {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

export interface Docente {
  id?: number;
  usuario: Usuario;
  identificacion: string;
  tipoContrato: string;
  estado: string;
  horasMinimas: number;
  horasMaximas: number;
  asignaturas: Asignatura[];
  disponibilidades: Disponibilidad[];
}

export interface DocenteCreate {
  identificacion: string;
  tipoContrato: string;
  estado: string;
  horasMinimas: number;
  horasMaximas: number;
  idUsuario: number;
  asignaturasIds: number[];
}