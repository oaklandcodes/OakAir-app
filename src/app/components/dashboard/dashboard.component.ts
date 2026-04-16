import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { FlightService } from '../../services/flight.service';
import { LogoutModal } from '../logout-modal/logout-modal.component';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FlightJournal } from '../../model/flight.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LogoutModal, BrandLogoComponent, NavbarComponent],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private flightService = inject(FlightService);
  private router = inject(Router);

  // Signals base
  username = this.authService.username;
  showLogoutModal = signal(false);
  flightCount = signal(0);
  flightJournal = signal<FlightJournal[]>([]); // Signal tipado listo

  // Datos VIP dinámicos
  miles = signal(84200);
  memberStatus = signal('Oak Reserve Gold');

  // Inicial del usuario para el avatar
  userInitial = computed(() => this.username()?.charAt(0).toUpperCase() || 'U');

  // Saludo dinámico según la hora
  userGreeting = computed(() => {
    const user = this.username();
    const hour = new Date().getHours();
    let greeting = 'Buenos días';

    if (hour >= 12 && hour < 18) {
      greeting = 'Buenas tardes';
    } else if (hour >= 18) {
      greeting = 'Buenas noches';
    }

    return user ? `${greeting}, ${user}` : 'Bienvenido';
  });

  ngOnInit() {
    this.loadFlightCount();
    this.loadFlightJournal(); // <-- ¡Añadido! Cargamos el historial al iniciar
  }

  loadFlightCount() {
    this.flightService.getflights().subscribe((flights) => {
      this.flightCount.set(flights.length);
    });
  }
  // Nueva función para obtener el historial desde el servicio
  loadFlightJournal() {
    this.flightService.getFlights().subscribe((history: FlightJournal[]) => {
      this.flightJournal.set(history);
    });
  }

  openLogoutModal() {
    this.showLogoutModal.set(true);
  }
  closeLogoutModal() {
    this.showLogoutModal.set(false);
  }

  logout() {
    this.showLogoutModal.set(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToFlights() {
    this.router.navigate(['/flights']);
  }
  goToSearch() {
    this.router.navigate(['/search']);
  }
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
