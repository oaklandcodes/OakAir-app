import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  username: string;
  expiresIn: number;
}

export abstract class AuthService {
  abstract readonly isAuthenticated: Signal<boolean>;
  abstract readonly username: Signal<string | null>;

  abstract getToken(): string | null;
  abstract checkStatus(): boolean;
  abstract login(email: string, password: string): Observable<LoginResponse>;
  abstract newUser(username: string, email: string, password: string): Observable<void>;
  abstract logout(): void;
}
