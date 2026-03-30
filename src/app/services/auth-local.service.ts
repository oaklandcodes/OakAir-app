import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { delay, Observable, of, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { AuthService, LoginResponse } from './auth';

@Injectable()
export class LocalAuthService extends AuthService {
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = 'auth-token';
  private readonly USERS_KEY = 'auth-users';

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
    const users = this.getUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { message: 'Credenciales incorrectas' },
          }),
      );
    }

    const expiresIn = 60 * 60 * 8;
    const payload = {
      username: user.username,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    };

    const response: LoginResponse = {
      token: this.buildFakeJwt(payload),
      username: user.username,
      expiresIn,
    };

    this._token.set(response.token);
    this._username.set(response.username);
    this.setStorageItem(this.TOKEN_KEY, response.token);
    this._isAuthenticated.set(true);

    return of(response).pipe(delay(250));
  }

  newUser(username: string, email: string, password: string): Observable<void> {
    const users = this.getUsers();
    const emailAlreadyExists = users.some((item) => item.email.toLowerCase() === email.toLowerCase());

    if (emailAlreadyExists) {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 409,
            error: { message: 'Este email ya esta registrado' },
          }),
      );
    }

    const nextUsers: User[] = [...users, { username, email, password }];
    this.setStorageItem(this.USERS_KEY, JSON.stringify(nextUsers));

    return of(void 0).pipe(delay(250));
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

  private getUsers(): User[] {
    const raw = this.getStorageItem(this.USERS_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as User[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private buildFakeJwt(payload: Record<string, unknown>): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = this.toBase64Url(JSON.stringify(header));
    const encodedPayload = this.toBase64Url(JSON.stringify(payload));
    const signature = this.toBase64Url('local-dev-signature');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private toBase64Url(value: string): string {
    return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
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
