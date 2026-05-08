import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth';
import { extractPayloadFromToken, isTokenExpired, removeStorageItem } from '../utils/jwt-utils';

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
    );
  }

  logout() {
     this._isLoggedIn.next(false);
     this.authService.logout();
  }

  private initializeAuthFromStorage(): void {
    const token = this.getStorageItem(this.TOKEN_KEY);
    if (!token) return;

    if (isTokenExpired(token)) {
      removeStorageItem(this.TOKEN_KEY);
      return;
    }

    this._isLoggedIn.next(true);
  }

  private getStorageItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }
}
