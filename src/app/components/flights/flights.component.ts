import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { RouterLink } from '@angular/router';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight } from '../../model/flight.model';
import { FlightService } from '../../services/flight.service';
import { LogoutModal } from '../logout-modal/logout-modal.component';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [RouterLink, FlightCardComponent,LogoutModal], // Aquí podrías añadir CommonModule si usas directivas como *ngFor
  templateUrl: './flights.html',
  
})

  export class FlightsComponent implements OnInit {
  // 1. Inyectamos los servicios necesarios
  private authService = inject(AuthService);
  private router = inject(Router);
  private flightService = inject(FlightService);

  // 1. EL INTERRUPTOR (Signal) 💡
  // Este Signal es como un interruptor de luz. 
  // false = Modal apagado/escondido.
  // true = Modal encendido/visible.
  showLogoutModal = signal(false);

  // 2. Signal para almacenar los vuelos
  flights = signal<Flight[]>([]);

    ngOnInit(): void {
    // 3. Cargamos los vuelos al inicializar el componente
    this.flightService.getflights().subscribe((flightsList) => {
      this.flights.set(flightsList);
    });
  }

// 2. ABRIR EL MODAL 🚪
  openLogoutConfirmation() {
    this.showLogoutModal.set(true);
  }

  // 3. CANCELAR (El "No" del modal) ❌
  cancelLogout() {
    this.showLogoutModal.set(false);
  }

  handleReserve(flight: Flight) {
    console.log('Vuelo reservado:', flight);
    alert(`Capitán, ha seleccionado el vuelo ${flight.id}`);
  }


  logout() {
    this.showLogoutModal.set(false); // Cerramos el modal
    this.authService.logout();       // Limpiamos auth
    this.router.navigate(['/login']); // ¡Buen viaje!
  }
}