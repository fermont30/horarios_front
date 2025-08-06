import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private decodeToken(token: string): any | null {
    try {
      if (token.split('.').length !== 3) {
        return null;
      }
      
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    // Verifica roles de diferentes maneras posibles
    if (Array.isArray(decoded.roles)) {
      return decoded.roles.includes('admin');
    } else if (typeof decoded.roles === 'string') {
      return decoded.roles === 'admin';
    } else if (decoded.role) { // Algunas APIs usan 'role' singular
      return decoded.role === 'admin';
    }

    return false;
  }


hasUserRole(): boolean {
  const token = this.getToken();
  if (!token) return false;

  const decoded = this.decodeToken(token);
  if (!decoded) return false;

  // Verifica roles de diferentes maneras posibles
  if (Array.isArray(decoded.roles)) {
    return decoded.roles.includes('user');
  } else if (typeof decoded.roles === 'string') {
    return decoded.roles === 'user';
  } else if (decoded.role) { // Algunas APIs usan 'role' singular
    return decoded.role === 'user';
  }

  return false;
}




  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    return decoded?.id || decoded?.sub || null;
  }
}