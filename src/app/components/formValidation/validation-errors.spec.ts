import { getValidationText } from './validation-errors';

describe('getValidationText', () => {
  it('should return empty array for null errors', () => {
    expect(getValidationText(null)).toEqual([]);
  });

  it('should return empty array for empty errors object', () => {
    expect(getValidationText({})).toEqual([]);
  });

  it('should return required message for required error', () => {
    expect(getValidationText({ required: true })).toContain('El campo es requerido');
  });

  it('should return minlength message with required length', () => {
    const result = getValidationText({ minlength: { requiredLength: 8 } });
    expect(result).toContain('Tamaño minimo: 8');
  });

  it('should return email message for email error', () => {
    expect(getValidationText({ email: true })).toContain('Formato de email inválido');
  });

  it('should return pattern message for pattern error', () => {
    const result = getValidationText({ pattern: true });
    expect(result[0]).toContain('mayúscula');
    expect(result[0]).toContain('número');
  });

  it('should return fieldsMismatch message', () => {
    expect(getValidationText({ fieldsMismatch: true })).toContain('Los campos no coinciden');
  });

  it('should return multiple messages for multiple errors', () => {
    const result = getValidationText({ required: true, email: true });
    expect(result.length).toBeGreaterThan(1);
  });
});
