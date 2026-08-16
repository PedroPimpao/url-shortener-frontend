'use server';

import { redirect } from 'next/navigation';
import { api } from '@/lib/api';
import { clearSession, saveSession } from '@/lib/session';
import type { ActionState } from './types';

const errorMessage = (reason: unknown, fallback: string) =>
  reason instanceof Error ? reason.message : fallback;

export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const tokens = await api.login({
      email: String(formData.get('email') ?? '')
        .trim()
        .toLowerCase(),
      password: String(formData.get('password') ?? ''),
    });
    await saveSession(tokens.access_token, tokens.refresh_token);
  } catch (reason) {
    return { error: errorMessage(reason, 'Não foi possível entrar.') };
  }
  redirect('/dashboard');
}

export async function signupAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!formData.get('agree')) {
    return {
      error:
        'Você precisa aceitar os Termos de Uso e a Política de Privacidade.',
    };
  }
  try {
    const firstName = String(
      formData.get('firstName') ?? formData.get('name') ?? '',
    ).trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    await api.createAccount({
      name: [firstName, lastName].filter(Boolean).join(' '),
      email: String(formData.get('email') ?? '')
        .trim()
        .toLowerCase(),
      password: String(formData.get('password') ?? ''),
    });
  } catch (reason) {
    return { error: errorMessage(reason, 'Não foi possível criar a conta.') };
  }
  redirect('/login');
}

export async function logoutAction() {
  await clearSession();
  redirect('/login');
}

export async function requestPasswordResetAction(
  _state: ActionState<{ email: string; otp?: string }>,
  formData: FormData,
): Promise<ActionState<{ email: string; otp?: string }>> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  try {
    const result = await api.requestPasswordReset(email);
    return { message: result.message, data: { email, otp: result.otp } };
  } catch (reason) {
    return { error: errorMessage(reason, 'Não foi possível enviar o código.') };
  }
}

export async function verifyPasswordResetAction(
  _state: ActionState<{ token: string }>,
  formData: FormData,
): Promise<ActionState<{ token: string }>> {
  try {
    const result = await api.verifyPasswordReset(
      String(formData.get('email') ?? ''),
      String(formData.get('otp') ?? ''),
    );
    return { data: { token: result.reset_token } };
  } catch (reason) {
    return {
      error: errorMessage(reason, 'Não foi possível verificar o código.'),
    };
  }
}

export async function completePasswordResetAction(
  _state: ActionState<{ done: boolean }>,
  formData: FormData,
): Promise<ActionState<{ done: boolean }>> {
  const password = String(formData.get('password') ?? '');
  const confirmation = String(formData.get('confirmation') ?? '');
  if (password !== confirmation)
    return { error: 'A nova senha e a confirmação precisam ser iguais.' };
  try {
    await api.completePasswordReset(
      String(formData.get('token') ?? ''),
      password,
      confirmation,
    );
    return { data: { done: true } };
  } catch (reason) {
    return {
      error: errorMessage(reason, 'Não foi possível redefinir sua senha.'),
    };
  }
}

type RecoveryData = {
  step: 'request' | 'verify' | 'complete' | 'done';
  email?: string;
  token?: string;
  otp?: string;
};

export async function passwordRecoveryAction(
  state: ActionState<RecoveryData>,
  formData: FormData,
): Promise<ActionState<RecoveryData>> {
  const step = String(formData.get('step') ?? state.data?.step ?? 'request');
  const email = String(formData.get('email') ?? state.data?.email ?? '')
    .trim()
    .toLowerCase();
  try {
    if (formData.get('intent') === 'resend') {
      const result = await api.requestPasswordReset(email);
      return {
        message: result.message,
        data: { step: 'verify', email, otp: result.otp },
      };
    }
    if (step === 'request') {
      const result = await api.requestPasswordReset(email);
      return {
        message: result.message,
        data: { step: 'verify', email, otp: result.otp },
      };
    }
    if (step === 'verify') {
      const result = await api.verifyPasswordReset(
        email,
        String(formData.get('otp') ?? ''),
      );
      return { data: { step: 'complete', email, token: result.reset_token } };
    }
    const password = String(formData.get('password') ?? '');
    const confirmation = String(formData.get('confirmation') ?? '');
    if (password !== confirmation) {
      return {
        error: 'A nova senha e a confirmação precisam ser iguais.',
        data: state.data,
      };
    }
    await api.completePasswordReset(
      String(formData.get('token') ?? state.data?.token ?? ''),
      password,
      confirmation,
    );
    return { data: { step: 'done' } };
  } catch (reason) {
    return {
      error: errorMessage(reason, 'Não foi possível redefinir sua senha.'),
      data: state.data,
    };
  }
}
