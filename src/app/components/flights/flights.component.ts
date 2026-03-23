import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [RouterLink], // Aquí podrías añadir CommonModule si usas directivas como *ngFor
  templateUrl: './flights.html',
})
export class FlightsComponent {
  // 1. Inyectamos los servicios necesarios
  private authService = inject(AuthService);
  private router = inject(Router);

  // 2. Creamos una lista de vuelos de ejemplo (esto normalmente vendría de una API)
  public flights = [
    { id: 'VY1234', origin: 'BCN', destination: 'ORY', time: '08:30' },
    { id: 'VY5678', origin: 'MAD', destination: 'BCN', time: '12:15' },
    { id: 'VY9012', origin: 'BCN', destination: 'FCO', time: '18:45' }
  ];

  // 3. La función para salir
  logout() {
    this.authService.logout(); // Cambiamos isAuthenticated a false en el servicio
    this.router.navigate(['/login']); // Redirigimos al usuario al login
  }
}