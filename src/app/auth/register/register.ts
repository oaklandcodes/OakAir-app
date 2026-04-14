import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { OakAirValidators } from '../../utils/validators';
import { matchFields } from '../../components/formValidation/validations';
import { getValidationText } from '../../components/formValidation/validation-errors';
import { HttpErrorResponse } from '@angular/common/http';
import { merge, startWith } from 'rxjs';
import {
  AUTH_VALIDATION_MESSAGES,
  AUTH_VALIDATION_RULES,
  BackendValidationError,
  normalizeBackendFieldMessage,
} from '../../shared/auth-validation';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { FormSubmitButtonComponent } from '../../components/form-submit-button/form-submit-button.component';
import { BrandLogoComponent } from '../../components/brand-logo/brand-logo.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormInputComponent, FormSubmitButtonComponent, BrandLogoComponent],
  templateUrl: './register.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signal para manejar el estado de carga
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Formulario reactivo con validaciones

  registerForm = this.fb.group({
    firstName: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.minLength(AUTH_VALIDATION_RULES.usernameMinLength),
        OakAirValidators.forbiddenName,
      ],
      nonNullable: true,
    }),
    lastName: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.minLength(AUTH_VALIDATION_RULES.usernameMinLength),
        OakAirValidators.forbiddenName,
      ],
      nonNullable: true,
    }),
    email: this.fb.control('', {
      validators: [Validators.required, OakAirValidators.email],
      nonNullable: true,
    }),
    password: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.minLength(AUTH_VALIDATION_RULES.passwordMinLength),
        OakAirValidators.passwordStrength(),
      ],
      nonNullable: true,
    }),
    confirmPassword: this.fb.control('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  }, { validators: matchFields('password', 'confirmPassword') });

  readonly firstNameControl = this.registerForm.controls.firstName;
  readonly lastNameControl = this.registerForm.controls.lastName;
  readonly emailControl = this.registerForm.controls.email;
  readonly passwordControl = this.registerForm.controls.password;
  readonly confirmPasswordControl = this.registerForm.controls.confirmPassword;

  constructor() {
    this.bindFrontendApiError(this.firstNameControl, () => {
      if (!this.firstNameControl.touched) return null;
      if (this.firstNameControl.hasError('required')) return AUTH_VALIDATION_MESSAGES.username.required;
      if (this.firstNameControl.hasError('forbiddenName')) return AUTH_VALIDATION_MESSAGES.username.forbidden;
      if (this.firstNameControl.hasError('minlength')) return AUTH_VALIDATION_MESSAGES.username.minLength;
      return null;
    });

    this.bindFrontendApiError(this.lastNameControl, () => {
      if (!this.lastNameControl.touched) return null;
      if (this.lastNameControl.hasError('required')) return AUTH_VALIDATION_MESSAGES.username.required;
      if (this.lastNameControl.hasError('forbiddenName')) return AUTH_VALIDATION_MESSAGES.username.forbidden;
      if (this.lastNameControl.hasError('minlength')) return AUTH_VALIDATION_MESSAGES.username.minLength;
      return null;
    });

    this.bindFrontendApiError(this.emailControl, () => {
      if (!this.emailControl.touched) return null;
      if (this.emailControl.hasError('required')) return AUTH_VALIDATION_MESSAGES.email.required;
      if (this.emailControl.hasError('email')) return AUTH_VALIDATION_MESSAGES.email.invalid;
      return null;
    });

    this.bindFrontendApiError(this.passwordControl, () => {
      if (!this.passwordControl.touched) return null;
      if (this.passwordControl.hasError('required')) return AUTH_VALIDATION_MESSAGES.password.required;
      if (this.passwordControl.hasError('minlength')) return AUTH_VALIDATION_MESSAGES.password.minLength;
      if (this.passwordControl.hasError('passwordStrength')) return AUTH_VALIDATION_MESSAGES.password.strength;
      return null;
    });

    this.bindFrontendApiError(this.confirmPasswordControl, () => {
      if (!this.confirmPasswordControl.touched) return null;
      const errors = this.confirmPasswordControl.errors;
      if (errors?.['required']) return 'El campo es requerido';
      if (errors?.['fieldsMismatch']) return 'Los campos no coinciden';
      return null;
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

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.registerForm.disable();
    this.loading.set(true);
    this.errorMessage.set(null);

    // llamamos al servicio de autenticación para registrar al usuario
    const { firstName, lastName, email, password } = this.registerForm.getRawValue();
    const username = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim();

    this.authService.newUser(username, email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.registerForm.enable();
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.registerForm.enable();

        const backendMessage = err.error?.message ?? '';

        // Algunos backends mandan email repetido como 409 y otros como 400
        if (err.status === 409) {
          const emailControl = this.registerForm.get('email');
          emailControl?.setErrors({
            ...emailControl.errors,
            apiError: AUTH_VALIDATION_MESSAGES.email.alreadyExists,
            apiErrorSource: 'backend',
          });
          emailControl?.markAsTouched();
          this.errorMessage.set(AUTH_VALIDATION_MESSAGES.email.alreadyExists);
          return;
        }

        if (err.status === 400 && err.error?.errors?.length) {
          err.error.errors.forEach(({ field, message }: BackendValidationError) => {
            const control = field === 'username' ? this.firstNameControl : this.registerForm.get(field);
            if (control) {
              const normalizedMessage = normalizeBackendFieldMessage(field, message);
              control.setErrors({
                ...control.errors,
                apiError: normalizedMessage,
                apiErrorSource: 'backend',
              });
              control.markAsTouched();
            }
          });
          this.errorMessage.set(null);
          return;
        }

        this.errorMessage.set(backendMessage || AUTH_VALIDATION_MESSAGES.generic.registerError);
      },
    });
  }
}
