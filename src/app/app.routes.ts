import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'flights',
    loadComponent: () => import('./components/flights/flights.component').then((m) => m.FlightsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'search',
    loadComponent: () => import('./components/flight-search/flight-search.component').then((m) => m.FlightSearchComponent),
    canActivate: [authGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
