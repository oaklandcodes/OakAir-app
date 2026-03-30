import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  username: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth-token';

  // Signal para almacenar el token en memoria
  private readonly _token = signal<string | null>(this.loadTokenFromStorage());
  
  // Al iniciar la aplicación, comprobamos si ya hay un token en memoria
  // esto evita que el f5 se desloguee al recargar la página
  private readonly _isAuthenticated = signal<boolean>(!!this.getToken());
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  private readonly _username = signal<string | null>(null);
  readonly username = this._username.asReadonly();

  // Obtener el token del signal en memoria
  getToken(): string | null {
    return this._token();
  }

  // Método para consultar el estado (lo usará el Guard)
  checkStatus(): boolean {
    return this.isAuthenticated();
  }

  // Login real contra backend
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:3000/auth/login', { email, password })
      .pipe(
        tap((response) => {
          this._token.set(response.token);
          this._username.set(response.username);
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this._isAuthenticated.set(true);
        }),
      );
  }

  // Registro del nuevo usuario
  newUser(username: string, email: string, password: string): Observable<void> {
    return this.http
      .post<void>('http://localhost:3000/auth/register', { username, email, password });
  }

  // Logout
  logout() {
    this._token.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    this._isAuthenticated.set(false);
    this._username.set(null);
    this.router.navigate(['/login']);
  }

  // ============ Métodos privados ============

  // Cargar token del localStorage solo una vez al iniciar
  private loadTokenFromStorage(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;
    
    // Validar que el token no esté expirado
    if (this.isTokenExpired(token)) {
      localStorage.removeItem(this.TOKEN_KEY);
      return null;
    }
    
    // Extraer username del token y cargarlo en memoria
    const payload = this.extractPayloadFromToken(token);
    if (payload && payload['username']) {
      this._username.set(payload['username'] as string || "Viajero");
    }
    
    return token;
  }

  // Extraer el payload del JWT
  private extractPayloadFromToken(token: string): Record<string, unknown> | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>;
      return payload;
    } catch {
      return null;
    }
  }

  // Validar si el token ha expirado
  private isTokenExpired(token: string): boolean {
    const payload = this.extractPayloadFromToken(token);
    if (!payload) return true;
    
    try {
      const exp = payload['exp'] as number;
      return exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
