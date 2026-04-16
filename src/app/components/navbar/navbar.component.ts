import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LogoutModal } from '../logout-modal/logout-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoutModal],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  // 1. Inyectamos los servicios
  private authService = inject(AuthService);
  private router = inject(Router);

  // 2. Traemos el nombre del usuario desde el AuthService
  username = this.authService.username;

  // 3. Signal para el control del modal de Logout
  showLogoutModal = signal(false);

  // --- MÉTODOS DE CONTROL ---

  // Abre el modal al hacer clic en Logout
  openLogout() {
    this.showLogoutModal.set(true);
  }

  // Cierra el modal si el usuario se arrepiente (Click en No/Cancelar)
  cancelLogout() {
    this.showLogoutModal.set(false);
  }

  // Ejecuta el cierre de sesión real
  confirmLogout() {
    this.showLogoutModal.set(false); // Cerramos el modal primero
    this.authService.logout();       // Limpiamos los datos de sesión
    this.router.navigate(['/login']); // ¡Nos vemos, capitán!
  }
}
