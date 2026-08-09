import { clearSession, getAccessToken } from '@/lib/session';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'
).replace(/\/$/, '');
type ApiOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  authenticated?: boolean;
};
type ValidationIssue = { msg?: string };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (options.authenticated) {
    const token = getAccessToken();
    if (!token) throw new ApiError('Sua sessão expirou. Entre novamente.', 401);
    headers.set('Authorization', `Bearer ${token}`);
  }
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError('Não foi possível conectar à API.', 0);
  }
  const data = (await response.json().catch(() => ({}))) as {
    detail?: string | ValidationIssue[];
  };
  if (!response.ok) {
    if (response.status === 401 && options.authenticated) clearSession();
    const detail = Array.isArray(data.detail)
      ? data.detail
          .map((item) => item.msg)
          .filter(Boolean)
          .join('. ')
      : data.detail;
    throw new ApiError(
      detail || 'Não foi possível concluir a operação.',
      response.status,
    );
  }
  return data as T;
}

export type User = { id: string; name: string; email: string };
export type ShortUrl = {
  'original-url': string;
  'short-code': string;
  clicks: number;
  title?: string;
};

export const api = {
  createAccount: (body: { name: string; email: string; password: string }) =>
    request<{ message: string; email: string }>('/auth/create-account', {
      method: 'POST',
      body,
    }),
  login: (body: { email: string; password: string }) =>
    request<{ access_token: string; refresh_token: string }>('/auth/login', {
      method: 'POST',
      body,
    }),
  me: () => request<User>('/auth/me', { authenticated: true }),
  requestPasswordReset: (email: string) =>
    request<{ message: string; otp?: string }>('/auth/password-reset/request', {
      method: 'POST',
      body: { email },
    }),
  verifyPasswordReset: (email: string, otp: string) =>
    request<{ reset_token: string }>('/auth/password-reset/verify', {
      method: 'POST',
      body: { email, otp },
    }),
  completePasswordReset: (
    token: string,
    password: string,
    confirmation: string,
  ) =>
    request<{ message: string }>('/auth/password-reset/complete', {
      method: 'POST',
      body: {
        reset_token: token,
        new_password: password,
        new_password_confirmation: confirmation,
      },
    }),
  listUrls: () =>
    request<{ urls: ShortUrl[] }>('/url/list_urls', { authenticated: true }),
  createShortUrl: (originalUrl: string) =>
    request<{ 'short-code': string; 'short-url': string }>(
      '/url/create-short-url',
      {
        method: 'POST',
        authenticated: true,
        body: { original_url: originalUrl },
      },
    ),
  accessUrl: (code: string) =>
    request<{ message: string; 'original-url': string; clicks: number }>(
      `/url/access-url/${encodeURIComponent(code)}`,
      { authenticated: true },
    ),
  updateUrlTitle: (code: string, title: string) =>
    request<{ message: string; 'new-title': string }>(
      `/url/update-title/${encodeURIComponent(code)}`,
      {
        method: 'PATCH',
        authenticated: true,
        body: { title },
      },
    ),
  generateQrCode: (code: string) =>
    request<{ qrcode: string }>(
      `/url/generate-qrcode/${encodeURIComponent(code)}`,
      { authenticated: true },
    ),
  updateName: (name: string) =>
    request<{ name: string }>('/user/update-name', {
      method: 'PATCH',
      authenticated: true,
      body: { new_name: name },
    }),
  updateEmail: (currentEmail: string, newEmail: string, password: string) =>
    request<{ email: string }>('/user/update-email', {
      method: 'PATCH',
      authenticated: true,
      body: { current_email: currentEmail, new_email: newEmail, password },
    }),
  updatePassword: (
    email: string,
    currentPassword: string,
    password: string,
    confirmation: string,
  ) =>
    request<{ message: string }>('/user/update-password', {
      method: 'PATCH',
      authenticated: true,
      body: {
        email,
        current_password: currentPassword,
        new_password: password,
        new_password_confirmation: confirmation,
      },
    }),
};
