import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth-token'; // definimos una constante para guardar el token en localStorage


  // Método seguro para obtener el token, solo accede a localStorage si estamos en un entorno de navegador
  getSafeToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  // Al iniciar la aplicación, comprobamos si ya hay un token en localStorage
  // esto evita que que el f5 se desloguee al recargar la página
  private _isAuthenticated = signal<boolean>(!!this.getSafeToken());
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  // 1. Método para obtener el token (lo usará el Interceptor)
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 2. Método para consultar el estado (lo usará el Guard)
  // En Angular 18, para leer un signal se usan paréntesis ()
  checkStatus(): boolean {
    return this.isAuthenticated();
  }

  // 3. Login real contra backend
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:3000/auth/login', { email, password })
      .pipe(
        tap((response) => {
          // Solo guardamos si hay ventana (navegador)
          if (typeof window !== 'undefined') {
            localStorage.setItem(this.TOKEN_KEY, response.token);
          }
          this._isAuthenticated.set(true);
        }),
      );
  }

  logout() {
    // 1. Borramos del cajón (solo si hay ventana)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    // 2. Avisamos a toda la app que ya no estamos autenticados
    this._isAuthenticated.set(false);
    
    // 3. Mandamos al usuario de patitas a la calle (al Login)
    this.router.navigate(['/login']);
  }
}
