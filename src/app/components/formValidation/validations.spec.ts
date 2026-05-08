import { TestBed } from '@angular/core/testing';
import { matchFields } from './validations';
import { FormGroup, FormControl } from '@angular/forms';

describe('matchFields validator', () => {
  it('should return null when fields match', () => {
    const group = new FormGroup({
      password: new FormControl('Password1!'),
      confirmPassword: new FormControl('Password1!'),
    });

    const validator = matchFields('password', 'confirmPassword');
    const result = validator(group);
    expect(result).toBeNull();
  });

  it('should return error when fields do not match', () => {
    const group = new FormGroup({
      password: new FormControl('Password1!'),
      confirmPassword: new FormControl('Different1!'),
    });

    const validator = matchFields('password', 'confirmPassword');
    const result = validator(group);
    expect(result).toEqual({ fieldsMismatch: true });
  });

  it('should return null when one field is empty', () => {
    const group = new FormGroup({
      password: new FormControl('Password1!'),
      confirmPassword: new FormControl(''),
    });

    const validator = matchFields('password', 'confirmPassword');
    const result = validator(group);
    expect(result).toBeNull();
  });

  it('should return null when both fields are empty', () => {
    const group = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });

    const validator = matchFields('password', 'confirmPassword');
    const result = validator(group);
    expect(result).toBeNull();
  });
});
