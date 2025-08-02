import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Aula } from '../models/aula';

@Injectable({ providedIn: 'root' })
export class AulaService {
  private apiUrl = `${environment.apiUrl}aulas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.apiUrl);
  }

  getById(id: number): Observable<Aula> {
    return this.http.get<Aula>(`${this.apiUrl}/${id}`);
  }

  create(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.apiUrl, aula);
  }

  update(id: number, aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(`${this.apiUrl}/${id}`, aula);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}