import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Asignatura } from '../models/asignatura';

@Injectable({ providedIn: 'root' })
export class AsignaturaService {
  private apiUrl = `${environment.apiUrl}asignaturas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.apiUrl);
  }

  getById(id: number): Observable<Asignatura> {
    return this.http.get<Asignatura>(`${this.apiUrl}/${id}`);
  }

  create(asignatura: Asignatura): Observable<Asignatura> {
    return this.http.post<Asignatura>(this.apiUrl, asignatura);
  }

  update(id: number, asignatura: Asignatura): Observable<Asignatura> {
    return this.http.put<Asignatura>(`${this.apiUrl}/${id}`, asignatura);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}