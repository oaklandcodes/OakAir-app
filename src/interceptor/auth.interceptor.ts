import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../app/services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si tenemos token, clonamos la petición y le ponemos la cabecera
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }
// Si no hay token, simplemente pasamos la solicitud sin modificar
  return next(req);
};  

// ¿Cómo activar el Interceptor?
//No basta con crearlo, hay que decirle a Angular que lo use. Esto se hace en tu archivo de configuración principal (normalmente app.config.ts):