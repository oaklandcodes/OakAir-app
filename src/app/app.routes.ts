import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
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

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
