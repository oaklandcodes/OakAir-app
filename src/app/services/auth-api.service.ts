import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService, LoginResponse } from './auth';

@Injectable()
export class ApiAuthService extends AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth-token';

  private readonly _token = signal<string | null>(null);
  private readonly _isAuthenticated = signal<boolean>(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  private readonly _username = signal<string | null>(null);
  readonly username = this._username.asReadonly();

  constructor() {
    super();
    this.initializeAuthFromStorage();
  }

  getToken(): string | null {
    return this._token();
  }

  checkStatus(): boolean {
    return this.isAuthenticated();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginUrl = `${environment.apiBaseUrl}${environment.apiAuthPath}/login`;

    return this.http
      .post<LoginResponse>(loginUrl, { email, password })
      .pipe(
        tap((response) => {
          this._token.set(response.token);
          this._username.set(response.username);
          this.setStorageItem(this.TOKEN_KEY, response.token);
          this._isAuthenticated.set(true);
        }),
      );
  }

  newUser(username: string, email: string, password: string): Observable<void> {
    const registerUrl = `${environment.apiBaseUrl}${environment.apiAuthPath}/register`;
    return this.http.post<void>(registerUrl, { username, email, password });
  }

  logout(): void {
    this._token.set(null);
    this.removeStorageItem(this.TOKEN_KEY);
    this._isAuthenticated.set(false);
    this._username.set(null);
    this.router.navigate(['/login']);
  }

  private initializeAuthFromStorage(): void {
    const token = this.getStorageItem(this.TOKEN_KEY);
    if (!token) return;

    if (this.isTokenExpired(token)) {
      this.removeStorageItem(this.TOKEN_KEY);
      return;
    }

    const payload = this.extractPayloadFromToken(token);
    if (payload && payload['username']) {
      this._username.set(payload['username'] as string);
    }

    this._token.set(token);
    this._isAuthenticated.set(true);
  }

  private extractPayloadFromToken(token: string): Record<string, unknown> | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(this.fromBase64Url(payloadBase64)) as Record<string, unknown>;
      return payload;
    } catch {
      return null;
    }
  }

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

  private fromBase64Url(value: string): string {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return atob(padded);
  }

  private getStorageItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }

  private setStorageItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  }
}
