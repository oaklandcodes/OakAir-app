
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  // Signal interno mutable
  private _isAuthenticated = signal<boolean>(false);

  // Signal público de solo lectura para componentes/guards
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  // 2. Método para consultar el estado (lo usará el Guard)
  // En Angular 18, para leer un signal se usan paréntesis ()
  checkStatus(): boolean {
    return this.isAuthenticated();
  }

  // 3. Login real contra backend
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:3000/auth/login', { email, password })
      .pipe(tap(() => this._isAuthenticated.set(true)));
  }

  // 4. Método para salir
  logout() {
    this._isAuthenticated.set(false);
  }
}