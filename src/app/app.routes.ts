import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login/login.component';
import { FlightsComponent } from './components/flights/flights.component';
import { authGuard } from './guards/auth-guard'; // Importamos nuestro guard
import { FlightSearchComponent } from './components/flight-search/flight-search.component'; // Importamos el nuevo componente de búsqueda

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'flights', 
    component: FlightsComponent, 
    canActivate: [authGuard] // <--- Solo entras si el guard devuelve true
  },
  { 
    path: 'search', 
    component: FlightSearchComponent,
    canActivate: [authGuard] // <--- ¡Protégelo también! Solo para tripulación.
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
