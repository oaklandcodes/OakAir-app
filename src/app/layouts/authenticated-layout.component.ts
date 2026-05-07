import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { AuthFacadeService } from '../facade/auth.facade';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  selector: 'authenticated-layout',
  templateUrl: 'authenticated-layout.component.html',
})
export class AuthenticatedLayoutComponent implements OnInit, OnDestroy {
  private authFacade = inject(AuthFacadeService);
  private router = inject(Router);
  private destroyed$ = new Subject<void>();

  sub: Subscription | undefined;

  ngOnInit() {
    this.subscribirme();
  }

  subscribirme() {
    this.sub = this.authFacade.isLoggedIn$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isLoggedIn) => {
        if (!isLoggedIn) {
          // Si el usuario no está logueado, redirigimos al login
          this.router.navigate(['/login']);
        }
      });
  }

  volverASuscribirme() {
    this.destroyed$.next(); // Emitimos para limpiar la suscripción actual
    this.subscribirme();
  }

  ngOnDestroy() {
    // Aquí podríamos limpiar cualquier suscripción si fuera necesario

    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
