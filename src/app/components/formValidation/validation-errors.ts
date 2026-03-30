import { ValidationErrors } from '@angular/forms';

export function getValidationText(errors: ValidationErrors | null): Array<string> {
  const errorTexts: Array<string> = [];
  if (!errors) return [];
  if (errors['required']) errorTexts.push('El campo es requerido');
  if (errors['minlength']) errorTexts.push(`Tamaño minimo: ${errors['minlength'].requiredLength}`);
  if (errors['email']) errorTexts.push('Formato de email inválido');
  if (errors['pattern'])
    errorTexts.push('La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial');
  if (errors['fieldsMismatch']) errorTexts.push('Los campos no coinciden');
  return errorTexts;
}
