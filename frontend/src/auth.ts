const TOKEN_KEY = 'likegirl_token';
const LOGOUT_EVENT = 'likegirl:logout';

export function getAuthToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function notifyLogout(): void {
  clearAuthToken();
  window.dispatchEvent(new CustomEvent(LOGOUT_EVENT));
}

export function onLogout(callback: () => void): () => void {
  window.addEventListener(LOGOUT_EVENT, callback);
  return () => window.removeEventListener(LOGOUT_EVENT, callback);
}

export function authHeaders(): HeadersInit | undefined {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}
