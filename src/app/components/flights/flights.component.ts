import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight } from '../../model/flight.model';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [RouterLink, FlightCardComponent], // Aquí podrías añadir CommonModule si usas directivas como *ngFor
  templateUrl: './flights.html',
  
})

  export class FlightsComponent implements OnInit {
  // 1. Inyectamos los servicios necesarios
  private authService = inject(AuthService);
  private router = inject(Router);
  private flightService = inject(FlightService);

  // 2. Signal para almacenar los vuelos
  flights = signal<Flight[]>([]);

    ngOnInit(): void {
    // 3. Cargamos los vuelos al inicializar el componente
    this.flightService.getflights().subscribe((flightsList) => {
      this.flights.set(flightsList);
    });
  }

  handleReserve(flight: Flight) {
    console.log('Vuelo reservado:', flight);
    alert(`Capitán, ha seleccionado el vuelo ${flight.id}`);
  }


  logout() {
    this.authService.logout(); // Cambiamos isAuthenticated a false en el servicio
    this.router.navigate(['/login']); // Redirigimos al usuario al login
  }
}