import { inject } from '@angular/core';
import {CanActivateFn, Router,  } from '@angular/router';
import { AuthService } from '../services/auth';

// canActivateFn es como un molde de galleras, se usa para darle forma a la masa (funcion) --> fn es abreviatura de function
// le estás diciendo a Angular: "Asegúrate de que mi función tenga exactamente los ingredientes (parámetros) que tú esperas para un Guard
// Esos parámetros son (route, state), que aunque no los uses ahora mismo, el tipo CanActivateFn los exige para que la función sea válida
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Leemos el signal público de solo lectura del servicio
  if (authService.isAuthenticated()) {
    return true; // Adelante, puedes pasar a los vuelos
  } else {
    // Si no está autenticado, lo mandamos al login
    return router.parseUrl('/login');
  }
};