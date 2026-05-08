export interface JwtPayload {
  username?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown;
}

export function extractPayloadFromToken(token: string): JwtPayload | null {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(fromBase64Url(payloadBase64)) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = extractPayloadFromToken(token);
  if (!payload) return true;

  try {
    const exp = payload['exp'] as number;
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return atob(padded);
}

export function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}
