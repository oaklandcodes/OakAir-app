import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService, LoginResponse } from './auth';
import { extractPayloadFromToken, isTokenExpired, setStorageItem, removeStorageItem, getStorageItem } from '../utils/jwt-utils';

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
          setStorageItem(this.TOKEN_KEY, response.token);
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
    removeStorageItem(this.TOKEN_KEY);
    this._isAuthenticated.set(false);
    this._username.set(null);
    this.router.navigate(['/login']);
  }

  private initializeAuthFromStorage(): void {
    const token = getStorageItem(this.TOKEN_KEY);
    if (!token) return;

    if (isTokenExpired(token)) {
      removeStorageItem(this.TOKEN_KEY);
      return;
    }

    const payload = extractPayloadFromToken(token);
    if (payload && payload['username']) {
      this._username.set(payload['username'] as string);
    }

    this._token.set(token);
    this._isAuthenticated.set(true);
  }
}
