// services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import { LoginUsuario } from '../models/login-usuario';
import { isPlatformBrowser } from '@angular/common';
import { RegisterUsuario } from '../models/register-usuario';
import { Usuario, UsuarioUpdate } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl + 'auth';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(dto: LoginUsuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, dto).pipe(
      tap(response => {
        if (!response?.token) {
          throw new Error('Invalid token received');
        }        
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      })
    );
  }

  register(dto: RegisterUsuario): Observable<any> {
    const endpoint =
      dto.rol === 'staff'
        ? `${this.apiUrl}/register/staff`
        : `${this.apiUrl}/register`;

    const { rol, ...userData } = dto;

    return this.http.post<any>(endpoint, userData).pipe(
      tap(() => {
        console.log(`Registrado como ${dto.rol}`);
      })
    );
  }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  update(id: number, usuario: UsuarioUpdate): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
