export interface Asignatura {
  id?: number;
  nombre: string;
  codigo: string;
  creditos: number;
  semestre: number;
  idCarrera: number;
  carrera?: {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
  };
}