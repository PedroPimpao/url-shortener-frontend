import 'server-only';

import { cookies } from 'next/headers';

const ACCESS_TOKEN_KEY = 'link-precision.access-token';
const REFRESH_TOKEN_KEY = 'link-precision.refresh-token';
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_KEY)?.value ?? null;
}

export async function saveSession(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);
  if (refreshToken) {
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, cookieOptions);
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
}
