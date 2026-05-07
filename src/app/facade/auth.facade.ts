import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private authService = inject(AuthService);
  private readonly TOKEN_KEY = 'auth-token';

  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor() {
    this.initializeAuthFromStorage();
  }

  doLogin(email: string, password: string) {
    return this.authService.login(email, password).pipe(
      tap(() => this._isLoggedIn.next(true)),
      finalize(() => {})
    );
  }

  logout() {
     this._isLoggedIn.next(false);
     this.authService.logout();
  }

  private initializeAuthFromStorage(): void {
    const token = this.getStorageItem(this.TOKEN_KEY);
    if (!token) return;

    if (this.isTokenExpired(token)) {
      this.removeStorageItem(this.TOKEN_KEY);
      return;
    }

    const payload = this.extractPayloadFromToken(token);
    // if (payload && payload['username']) {
    //   this._username.set(payload['username'] as string);
    // }

    // this._token.set(token);
    this._isLoggedIn.next(true);
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
    return window.localStorage.getItem(key);
  }

  private setStorageItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    window.localStorage.removeItem(key);
  }
}
