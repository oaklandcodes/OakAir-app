import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../app/services/auth'; // Tu servicio

// ¿Cómo entenderlo con una analogía?
// Imagina que el HttpInterceptorFn es un filtro de agua en una tubería:

// req (Request): Es el agua sucia (la petición tal cual sale de tu componente).

// next: Es el tubo que sigue. Si no llamas a next(req), el agua se corta y la petición nunca llega al servidor.

// El Interceptor: Es el filtro que limpia el agua (añade el token) o que detecta si el agua viene con barro (error 401) antes de que llegue a tu grifo (tu componente).

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor nos dice que no estamos autorizados (401)
      if (error.status === 401) {
        console.warn('Sesión caducada o inválida. Cerrando sesión...');
        authService.logout(); // Usamos tu método logout que ya limpia todo
      }

      // Lanzamos el error para que el componente también pueda manejarlo si quiere
      const errorMessage = error.error?.message || 'Ocurrió un error inesperado';
      return throwError(() => new Error(errorMessage));
    }),
  );
};
