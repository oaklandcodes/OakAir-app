import {
  extractPayloadFromToken,
  isTokenExpired,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from './jwt-utils';

describe('jwt-utils', () => {
  describe('extractPayloadFromToken', () => {
    it('should extract payload from valid JWT', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ username: 'testuser', exp: 9999999999 }));
      const token = `${header}.${payload}.signature`;
      const result = extractPayloadFromToken(token);
      expect(result).toBeTruthy();
      expect(result!['username']).toBe('testuser');
    });

    it('should return null for invalid token', () => {
      expect(extractPayloadFromToken('invalid')).toBeNull();
    });

    it('should return null for token with invalid base64', () => {
      const token = 'abc.def!!!.sig';
      expect(extractPayloadFromToken(token)).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for token with future expiration', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ username: 'test', exp: Math.floor(Date.now() / 1000) + 3600 }));
      const token = `${header}.${payload}.sig`;
      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for expired token', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ username: 'test', exp: Math.floor(Date.now() / 1000) - 3600 }));
      const token = `${header}.${payload}.sig`;
      expect(isTokenExpired(token)).toBe(true);
    });

    it('should return false for token without exp claim (no expiration set)', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ username: 'test' }));
      const token = `${header}.${payload}.sig`;
      expect(isTokenExpired(token)).toBe(false);
    });

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true);
    });
  });

  describe('localStorage helpers', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should get null for non-existent key', () => {
      expect(getStorageItem('nonexistent')).toBeNull();
    });

    it('should set and get storage item', () => {
      setStorageItem('test-key', 'test-value');
      expect(getStorageItem('test-key')).toBe('test-value');
    });

    it('should remove storage item', () => {
      setStorageItem('test-key', 'test-value');
      removeStorageItem('test-key');
      expect(getStorageItem('test-key')).toBeNull();
    });

    it('should handle SSR (window undefined)', () => {
      const originalWindow = (globalThis as any).window;
      delete (globalThis as any).window;
      expect(getStorageItem('test')).toBeNull();
      (globalThis as any).window = originalWindow;
    });
  });
});
