import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AUTH_VALIDATION_MESSAGES, AUTH_VALIDATION_RULES } from '../../../shared/auth-validation';
import { getValidationText } from '../../../components/formValidation/validation-errors';
import { OakAirValidators } from '../../../utils/validators';
import { merge, startWith } from 'rxjs';
import { FormInputComponent } from '../../../components/form-input/form-input.component';
import { FormSubmitButtonComponent } from '../../../components/form-submit-button/form-submit-button.component';
import { BrandLogoComponent } from '../../../components/brand-logo/brand-logo.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FormInputComponent, FormSubmitButtonComponent, BrandLogoComponent, NavbarComponent],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  // Inyectamos el servicio de autenticación y el router
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, OakAirValidators.email]],
    password: ['', [Validators.required, Validators.minLength(AUTH_VALIDATION_RULES.passwordMinLength)]],
  });

  readonly emailControl = this.form.controls.email;
  readonly passwordControl = this.form.controls.password;

  constructor() {
    this.bindFrontendApiError(this.emailControl, () => {
      if (!this.emailControl.touched) return null;
      const validationErrors = getValidationText(this.emailControl.errors);
      return validationErrors.length > 0 ? validationErrors[0] : null;
    });

    this.bindFrontendApiError(this.passwordControl, () => {
      if (!this.passwordControl.touched) return null;
      const validationErrors = getValidationText(this.passwordControl.errors);
      return validationErrors.length > 0 ? validationErrors[0] : null;
    });
  }

  private bindFrontendApiError(control: FormControl<string>, getMessage: () => string | null): void {
    merge(control.statusChanges, control.valueChanges)
      .pipe(startWith(null), takeUntilDestroyed())
      .subscribe(() => this.setFrontendApiError(control, getMessage()));
  }

  private setFrontendApiError(control: FormControl<string>, message: string | null): void {
    const errors = control.errors ?? {};
    const source = errors['apiErrorSource'];
    const current = errors['apiError'];

    if (message) {
      if (source === 'frontend' && current === message) return;
      control.setErrors({ ...errors, apiError: message, apiErrorSource: 'frontend' });
      return;
    }

    if (source === 'frontend') {
      const { apiError, apiErrorSource, ...rest } = errors;
      control.setErrors(Object.keys(rest).length ? rest : null);
    }
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
            this.error.set(AUTH_VALIDATION_MESSAGES.generic.invalidCredentials);
          } else {
            this.error.set(err.error?.message ?? AUTH_VALIDATION_MESSAGES.generic.loginError);
          }
        },
      });
  }
}
