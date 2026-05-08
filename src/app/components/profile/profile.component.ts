import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { FlightService } from '../../services/flight.service';
import { LogoutModal } from '../logout-modal/logout-modal.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LogoutModal, NavbarComponent],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private flightService = inject(FlightService);
  private router = inject(Router);

  username = this.authService.username;
  showLogoutModal = signal(false);
  miles = signal(84200);
  memberStatus = signal('Oak Reserve Gold');

  userInitial = computed(() => {
    const name = this.username();
    if (!name || name.trim() === '') return null;
    return name.charAt(0).toUpperCase();
  });

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

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
