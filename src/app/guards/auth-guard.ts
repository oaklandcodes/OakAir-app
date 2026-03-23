import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard = () => {
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