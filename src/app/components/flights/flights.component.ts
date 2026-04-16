import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Flight } from '../../model/flight.model';
import { FlightService } from '../../services/flight.service';
import { LogoutModal } from '../logout-modal/logout-modal.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [FlightCardComponent, LogoutModal, NavbarComponent],
  templateUrl: './flights.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightsComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private flightService = inject(FlightService);

  showLogoutModal = signal(false);

  // 1. Almacenamos TODOS los vuelos del JSON aquí
  allFlights = signal<Flight[]>([]);

  // 2. Controlamos cuántos queremos ver (empezamos por 3)
  visibleCount = signal(3);

  // 3. Este es el Signal "mágico". Solo devuelve los que queremos mostrar.
  // Es el que usaremos en el HTML para el @for
  flights = computed(() => this.allFlights().slice(0, this.visibleCount()));

  username = computed(() => this.authService.username() || 'Viajero');

  ngOnInit(): void {
    this.flightService.getflights().subscribe((flightsList) => {
      this.allFlights.set(flightsList); // Guardamos la lista completa
    });
  }

  // 4. Función para mostrar el resto al pulsar el botón
  showMore() {
    this.visibleCount.set(this.allFlights().length);
  }

  showLess() {
    this.visibleCount.set(3);
    // Opcional: podrías añadir un window.scrollTo para devolver al usuario arriba
  }

  openLogoutConfirmation() {
    this.showLogoutModal.set(true);
  }
  cancelLogout() {
    this.showLogoutModal.set(false);
  }
  handleReserve(flight: Flight) {
    console.log('Vuelo reservado:', flight);
  }

  logout() {
    this.showLogoutModal.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
