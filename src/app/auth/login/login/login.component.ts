import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  // Inyectamos el servicio de autenticación y el router
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  // Getters para acceder a los controles del formulario desde la plantilla
  get emailControl() {
    return this.form.controls['email'];
  }

  get passwordControl() {
    return this.form.controls['password'];
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/flights']);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();
    if (!email || !password) {
      this.error.set('Email y password son obligatorios');
      this.loading.set(false);
      this.form.enable();
      return;
    }

    this.authService
      .login(email, password)
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.form.enable();
        }),
      )
      .subscribe({
        next: () => this.router.navigate(['/flights']),
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.error.set('Credenciales incorrectas');
          } else {
            this.error.set(err.error?.message ?? 'Error al iniciar sesión. Inténtalo de nuevo.');
          }
        },
      });
  }
}


