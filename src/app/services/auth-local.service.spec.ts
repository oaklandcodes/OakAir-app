import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalAuthService } from './auth-local.service';
import { firstValueFrom } from 'rxjs';

describe('LocalAuthService', () => {
  let service: LocalAuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocalAuthService],
    });
    service = TestBed.inject(LocalAuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('should return LoginResponse with token on valid credentials', async () => {
      await firstValueFrom(service.newUser('testuser', 'test@example.com', 'Password1!'));
      const response = await firstValueFrom(service.login('test@example.com', 'Password1!'));
      expect(response.token).toBeTruthy();
      expect(response.username).toBe('testuser');
      expect(response.expiresIn).toBe(60 * 60 * 8);
    });

    it('should set isAuthenticated to true on valid login', async () => {
      await firstValueFrom(service.newUser('testuser', 'test@example.com', 'Password1!'));
      await firstValueFrom(service.login('test@example.com', 'Password1!'));
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return 401 error on invalid password', async () => {
      await firstValueFrom(service.newUser('testuser', 'test@example.com', 'Password1!'));
      let errorCaught = false;
      try {
        await firstValueFrom(service.login('test@example.com', 'WrongPassword1!'));
      } catch (err: any) {
        errorCaught = true;
        expect(err.status).toBe(401);
        expect(service.isAuthenticated()).toBe(false);
      }
      expect(errorCaught).toBe(true);
    });

    it('should return 401 error on non-existent email', async () => {
      let errorCaught = false;
      try {
        await firstValueFrom(service.login('nonexistent@example.com', 'Password1!'));
      } catch (err: any) {
        errorCaught = true;
        expect(err.status).toBe(401);
        expect(service.isAuthenticated()).toBe(false);
      }
      expect(errorCaught).toBe(true);
    });

    it('should be case-insensitive for email', async () => {
      await firstValueFrom(service.newUser('testuser', 'Test@Example.com', 'Password1!'));
      const response = await firstValueFrom(service.login('TEST@EXAMPLE.COM', 'Password1!'));
      expect(response.username).toBe('testuser');
    });
  });

  describe('newUser', () => {
    it('should register a new user successfully', async () => {
      await firstValueFrom(service.newUser('newuser', 'new@example.com', 'Password1!'));
      const response = await firstValueFrom(service.login('new@example.com', 'Password1!'));
      expect(response.username).toBe('newuser');
    });

    it('should return 409 error if email already exists', async () => {
      await firstValueFrom(service.newUser('user1', 'duplicate@example.com', 'Password1!'));
      let errorCaught = false;
      try {
        await firstValueFrom(service.newUser('user2', 'duplicate@example.com', 'Password2!'));
      } catch (err: any) {
        errorCaught = true;
        expect(err.status).toBe(409);
      }
      expect(errorCaught).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear auth state on logout', async () => {
      await firstValueFrom(service.newUser('testuser', 'test@example.com', 'Password1!'));
      await firstValueFrom(service.login('test@example.com', 'Password1!'));
      expect(service.isAuthenticated()).toBe(true);
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.username()).toBeNull();
    });

    it('should clear token from localStorage on logout', async () => {
      await firstValueFrom(service.newUser('testuser', 'test@example.com', 'Password1!'));
      await firstValueFrom(service.login('test@example.com', 'Password1!'));
      service.logout();
      expect(localStorage.getItem('auth-token')).toBeNull();
    });
  });

  describe('session persistence', () => {
    it('should restore auth state from localStorage on init', async () => {
      await firstValueFrom(service.newUser('persistuser', 'persist@example.com', 'Password1!'));
      await firstValueFrom(service.login('persist@example.com', 'Password1!'));
      const token = service.getToken();
      localStorage.setItem('auth-token', token!);

      const freshService = TestBed.inject(LocalAuthService);
      expect(freshService.isAuthenticated()).toBe(true);
      expect(freshService.username()).toBe('persistuser');
    });
  });
});
