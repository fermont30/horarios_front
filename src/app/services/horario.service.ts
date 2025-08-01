// horario.service.ts - Versión actualizada
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Asignatura, Aula, Bloque, Docente, Horario, PeriodoAcademico } from '../models/horario';

// Interfaces para el API
export interface HorarioRequest {
  idPeriodo: number;
  idAsignatura: number;
  idDocente: number;
  idAula: number;
  idBloque: number;
  diaSemana: string;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private apiUrl = `${environment.apiUrl}horarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl);
  }

  create(horario: HorarioRequest): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario);
  }

  update(id: number, horario: HorarioRequest): Observable<Horario> {
    return this.http.put<Horario>(`${this.apiUrl}/${id}`, horario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos para obtener datos relacionados
  getPeriodos(): Observable<PeriodoAcademico[]> {
    return this.http.get<PeriodoAcademico[]>(`${environment.apiUrl}periodos-academicos`);
  }

  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${environment.apiUrl}asignaturas`);
  }

  getDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${environment.apiUrl}docentes`);
  }

  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${environment.apiUrl}aulas`);
  }

  getBloques(): Observable<Bloque[]> {
    return this.http.get<Bloque[]>(`${environment.apiUrl}bloques-horarios`);
  }
}