import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core'; // Añadido LOCALE_ID
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

// --- AÑADE ESTO PARA EL IDIOMA ESPAÑOL ---
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
// -----------------------------------------

import { routes } from './app.routes';
import { authInterceptor } from '../interceptor/auth.interceptor';
import { errorInterceptor } from '../interceptor/error.interceptors';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth';
import { ApiAuthService } from './services/auth-api.service';
import { LocalAuthService } from './services/auth-local.service';
import { FlightService } from './services/flight.service';
import { ApiFlightService } from './services/flight-api.service';
import { LocalFlightService } from './services/flight-local.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    
    // Añadimos este proveedor para que el CurrencyPipe sepa que estamos en España
    { provide: LOCALE_ID, useValue: 'es' },

    {
      provide: AuthService,
      useClass: environment.useLocalData ? LocalAuthService : ApiAuthService,
    },
    {
      provide: FlightService,
      useClass: environment.useLocalData ? LocalFlightService : ApiFlightService,
    },
  ],
};