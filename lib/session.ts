const ACCESS_TOKEN_KEY = 'link-precision.access-token';
const REFRESH_TOKEN_KEY = 'link-precision.refresh-token';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveSession(accessToken: string, refreshToken?: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken)
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}
