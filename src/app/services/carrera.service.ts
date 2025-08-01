import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Carrera } from '../models/carrera';

@Injectable({ providedIn: 'root' })
export class CarreraService {
  private apiUrl = `${environment.apiUrl}carreras`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrl);
  }

  getById(id: number): Observable<Carrera> {
    return this.http.get<Carrera>(`${this.apiUrl}/${id}`);
  }

  create(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.apiUrl, carrera);
  }

  update(id: number, carrera: Carrera): Observable<Carrera> {
    return this.http.put<Carrera>(`${this.apiUrl}/${id}`, carrera);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
