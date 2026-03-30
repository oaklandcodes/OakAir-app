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
   * Usa un Regex simple: requiere al menos una letra y un número
   */
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = String(control.value ?? '');
      if (!value) return null;

      // Regex: [0-9] busca números, [a-zA-Z] busca letras
      const hasNumber = /[0-9]/.test(value);
      const hasLetter = /[a-zA-Z]/.test(value);

      const isPasswordValid = hasNumber && hasLetter;

      // Si NO es válida, devolvemos el error 'passwordStrength'
      return !isPasswordValid ? { passwordStrength: true } : null;
    };
  }
}