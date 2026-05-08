import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { OakAirValidators } from './validators';
import { AbstractControl } from '@angular/forms';

describe('OakAirValidators', () => {
  describe('email', () => {
    it('should return null for valid email', () => {
      const control = { value: 'user@example.com' } as AbstractControl;
      expect(OakAirValidators.email(control)).toBeNull();
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as AbstractControl;
      expect(OakAirValidators.email(control)).toBeNull();
    });

    it('should return null for null value', () => {
      const control = { value: null } as AbstractControl;
      expect(OakAirValidators.email(control)).toBeNull();
    });

    it('should return error for invalid email without @', () => {
      const control = { value: 'userexample.com' } as AbstractControl;
      expect(OakAirValidators.email(control)).toEqual({ email: true });
    });

    it('should return error for invalid email without domain', () => {
      const control = { value: 'user@' } as AbstractControl;
      expect(OakAirValidators.email(control)).toEqual({ email: true });
    });

    it('should return error for email with spaces', () => {
      const control = { value: 'user @example.com' } as AbstractControl;
      expect(OakAirValidators.email(control)).toEqual({ email: true });
    });
  });

  describe('forbiddenName', () => {
    it('should return null for allowed name', () => {
      const control = { value: 'john' } as AbstractControl;
      expect(OakAirValidators.forbiddenName(control)).toBeNull();
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as AbstractControl;
      expect(OakAirValidators.forbiddenName(control)).toBeNull();
    });

    it('should return error for forbidden name "admin"', () => {
      const control = { value: 'admin' } as AbstractControl;
      expect(OakAirValidators.forbiddenName(control)).toEqual({ forbiddenName: true });
    });

    it('should return error for forbidden name case-insensitive', () => {
      const control = { value: 'ADMIN' } as AbstractControl;
      expect(OakAirValidators.forbiddenName(control)).toEqual({ forbiddenName: true });
    });

    it('should return error if name contains forbidden word', () => {
      const control = { value: 'myadminuser' } as AbstractControl;
      expect(OakAirValidators.forbiddenName(control)).toEqual({ forbiddenName: true });
    });
  });

  describe('passwordStrength', () => {
    it('should return null for strong password', () => {
      const control = { value: 'Password1!' } as AbstractControl;
      const validator = OakAirValidators.passwordStrength();
      expect(validator(control)).toBeNull();
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as AbstractControl;
      const validator = OakAirValidators.passwordStrength();
      expect(validator(control)).toBeNull();
    });

    it('should return error for password missing uppercase', () => {
      const control = { value: 'password1!' } as AbstractControl;
      const validator = OakAirValidators.passwordStrength();
      const result = validator(control);
      expect(result).toBeTruthy();
      expect(result!['passwordStrength']).toBeTruthy();
    });

    it('should return error for password missing lowercase', () => {
      const control = { value: 'PASSWORD1!' } as AbstractControl;
      const validator = OakAirValidators.passwordStrength();
      const result = validator(control);
      expect(result).toBeTruthy();
    });

    it('should return error for password missing number', () => {
      const control = { value: 'Password!' } as AbstractControl;
      const validator = OakAirValidators.passwordStrength();
      const result = validator(control);
      expect(result).toBeTruthy();
    });

    it('should return error for password missing special char', () => {
      const control = { value: 'Password1' } as AbstractControl;
      const validator = OakAirValidators.passwordStrength();
      const result = validator(control);
      expect(result).toBeTruthy();
    });
  });

  describe('getPasswordStrengthLevel', () => {
    it('should return 0 for empty password', () => {
      expect(OakAirValidators.getPasswordStrengthLevel('')).toBe(0);
    });

    it('should return 2 for lowercase only (lowercase + length bonus)', () => {
      expect(OakAirValidators.getPasswordStrengthLevel('password')).toBe(2);
    });

    it('should return 3 for lowercase + uppercase (char + length bonus)', () => {
      expect(OakAirValidators.getPasswordStrengthLevel('Password')).toBe(3);
    });

    it('should return 4 for lowercase + uppercase + number (char + length bonus)', () => {
      expect(OakAirValidators.getPasswordStrengthLevel('Password1')).toBe(4);
    });

    it('should return 5 for full strength', () => {
      expect(OakAirValidators.getPasswordStrengthLevel('Password1!')).toBe(5);
    });

    it('should return 5 for full strength with length >= 8', () => {
      expect(OakAirValidators.getPasswordStrengthLevel('LongPassword1!')).toBe(5);
    });
  });

  describe('getPasswordStrengthLabel', () => {
    it('should return Débil for score <= 2', () => {
      expect(OakAirValidators.getPasswordStrengthLabel(0)).toBe('Débil');
      expect(OakAirValidators.getPasswordStrengthLabel(2)).toBe('Débil');
    });

    it('should return Media for score 3-4', () => {
      expect(OakAirValidators.getPasswordStrengthLabel(3)).toBe('Media');
      expect(OakAirValidators.getPasswordStrengthLabel(4)).toBe('Media');
    });

    it('should return Fuerte for score >= 5', () => {
      expect(OakAirValidators.getPasswordStrengthLabel(5)).toBe('Fuerte');
    });
  });

  describe('getPasswordStrengthColor', () => {
    it('should return rose for score <= 2', () => {
      expect(OakAirValidators.getPasswordStrengthColor(0)).toBe('bg-rose-500');
      expect(OakAirValidators.getPasswordStrengthColor(2)).toBe('bg-rose-500');
    });

    it('should return amber for score 3-4', () => {
      expect(OakAirValidators.getPasswordStrengthColor(3)).toBe('bg-amber-500');
      expect(OakAirValidators.getPasswordStrengthColor(4)).toBe('bg-amber-500');
    });

    it('should return emerald for score >= 5', () => {
      expect(OakAirValidators.getPasswordStrengthColor(5)).toBe('bg-emerald-500');
    });
  });
});
