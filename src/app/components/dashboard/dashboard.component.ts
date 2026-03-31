import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { FlightService } from '../../services/flight.service';
import { LogoutModal } from '../logout-modal/logout-modal.component';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LogoutModal, BrandLogoComponent],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private flightService = inject(FlightService);
  private router = inject(Router);

  // Signals
  username = this.authService.username;
  isAuthenticated = this.authService.isAuthenticated;
  showLogoutModal = signal(false);
  flightCount = signal(0);

  // Computed
  userGreeting = computed(() => {
    const user = this.username();
    const hour = new Date().getHours();
    let greeting = 'Buenos días';

    if (hour >= 12 && hour < 18) {
      greeting = 'Buenas tardes';
    } else if (hour >= 18) {
      greeting = 'Buenas noches';
    }

    return user ? `${greeting}, ${user}! 🌍` : 'Bienvenido';
  });

  ngOnInit() {
    this.loadFlightCount();
  }

  loadFlightCount() {
    this.flightService.getflights().subscribe((flights) => {
      this.flightCount.set(flights.length);
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
