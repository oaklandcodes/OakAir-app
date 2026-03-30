export const AUTH_VALIDATION_RULES = {
  usernameMinLength: 3,
  passwordMinLength: 8,
  forbiddenUsernames: ['admin'],
};

export const AUTH_VALIDATION_MESSAGES = {
  username: {
    required: 'El nombre de viajero es obligatorio',
    minLength: `Minimo ${AUTH_VALIDATION_RULES.usernameMinLength} letras`,
    forbidden: 'Nombre reservado',
  },
  email: {
    required: 'El correo es obligatorio',
    invalid: 'Formato de correo invalido',
    alreadyExists: 'Este email ya esta registrado',
  },
  password: {
    required: 'La clave es obligatoria',
    minLength: `Debe tener al menos ${AUTH_VALIDATION_RULES.passwordMinLength} caracteres`,
    strength: 'Debe incluir letras y numeros',
  },
  generic: {
    registerError: 'Error al crear la cuenta. Intentalo de nuevo.',
    invalidCredentials: 'Credenciales incorrectas',
    loginError: 'Error al iniciar sesion. Intentalo de nuevo.',
  },
};

export type AuthField = 'username' | 'email' | 'password';

export interface BackendValidationError {
  field: string;
  message?: string;
}

export function normalizeBackendFieldMessage(field: string, backendMessage?: string): string {
  const message = (backendMessage ?? '').toLowerCase();

  if (field === 'username') {
    if (message.includes('admin') || message.includes('reserv')) {
      return AUTH_VALIDATION_MESSAGES.username.forbidden;
    }
    if (message.includes('min') || message.includes('length')) {
      return AUTH_VALIDATION_MESSAGES.username.minLength;
    }
    return AUTH_VALIDATION_MESSAGES.username.required;
  }

  if (field === 'email') {
    if (message.includes('exist') || message.includes('registr')) {
      return AUTH_VALIDATION_MESSAGES.email.alreadyExists;
    }
    if (message.includes('format') || message.includes('inval')) {
      return AUTH_VALIDATION_MESSAGES.email.invalid;
    }
    return AUTH_VALIDATION_MESSAGES.email.required;
  }

  if (field === 'password') {
    if (message.includes('min') || message.includes('length')) {
      return AUTH_VALIDATION_MESSAGES.password.minLength;
    }
    if (message.includes('number') || message.includes('digit') || message.includes('letra') || message.includes('letter')) {
      return AUTH_VALIDATION_MESSAGES.password.strength;
    }
    return AUTH_VALIDATION_MESSAGES.password.required;
  }

  return backendMessage?.trim() || AUTH_VALIDATION_MESSAGES.generic.registerError;
}