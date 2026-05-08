import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AUTH_VALIDATION_RULES } from '../shared/auth-validation';

export class OakAirValidators {
  
  /**
   * Validador de Email más estricto
   * Requiere el formato clásico: usuario@dominio.extensión
   */
  static email(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '');
    if (!value) return null; // Si está vacío, no validamos (se encarga Validators.required)

    // Regex para validar email: usuario@dominio.extensión
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(value);

    return !isValidEmail ? { email: true } : null;
  }

  /**
   * Validador para nombres prohibidos (Static)
   * No deja que el usuario use "admin" (mayúsculas o minúsculas)
   */
  static forbiddenName(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '');
    if (!value) return null; // Si está vacío, no validamos (se encarga Validators.required)

    const isForbidden = AUTH_VALIDATION_RULES.forbiddenUsernames.some((name) =>
      value.toLowerCase().includes(name.toLowerCase()),
    );
    
    // Si es prohibido, devolvemos un objeto con la "llave" del error
    // Si no, devolvemos null (indicando que el campo es VÁLIDO)
    return isForbidden ? { forbiddenName: true } : null;
  }

  /**
   * Validador de Fortaleza de Contraseña (ValidatorFn)
   * Requiere: letra minúscula + letra mayúscula + número + carácter especial
   */
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '');
      if (!value) return null;

      const hasLowercase = /[a-z]/.test(value);
      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const errors: string[] = [];
      if (!hasLowercase) errors.push('minúscula');
      if (!hasUppercase) errors.push('mayúscula');
      if (!hasNumber) errors.push('número');
      if (!hasSpecial) errors.push('carácter especial');

      if (errors.length > 0) {
        return { passwordStrength: { missing: errors } };
      }

      return null;
    };
  }

  static getPasswordStrengthLevel(password: string): number {
    if (!password) return 0;
    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    if (password.length >= 8) score++;
    return score;
  }

  static getPasswordStrengthLabel(score: number): string {
    if (score <= 2) return 'Débil';
    if (score <= 4) return 'Media';
    return 'Fuerte';
  }

  static getPasswordStrengthColor(score: number): string {
    if (score <= 2) return 'bg-rose-500';
    if (score <= 4) return 'bg-amber-500';
    return 'bg-emerald-500';
  }
}