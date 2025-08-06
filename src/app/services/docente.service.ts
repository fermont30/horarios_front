import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Docente, DocenteCreate, Usuario, Asignatura } from '../models/docente';

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private apiUrl = `${environment.apiUrl}docentes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Docente[]> {
    return this.http.get<Docente[]>(this.apiUrl);
  }

  getById(id: number): Observable<Docente> {
    return this.http.get<Docente>(`${this.apiUrl}/${id}`);
  }

  create(docente: DocenteCreate): Observable<Docente> {
    return this.http.post<Docente>(this.apiUrl, docente);
  }

  update(id: number, docente: DocenteCreate): Observable<Docente> {
    return this.http.put<Docente>(`${this.apiUrl}/${id}`, docente);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUsuariosDisponibles(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios-disponibles`);
  }

  getAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${environment.apiUrl}asignaturas`);
  }
}