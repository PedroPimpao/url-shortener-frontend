'use server';

import { redirect } from 'next/navigation';
import { api, type User } from '@/lib/api';
import type { ActionState } from './types';

const failure = <T>(reason: unknown, fallback: string): ActionState<T> => ({
  error: reason instanceof Error ? reason.message : fallback,
});

export async function getCurrentUserAction(): Promise<User | null> {
  try {
    return await api.me();
  } catch {
    return null;
  }
}

export async function updateProfileAction(
  _state: ActionState<User>,
  formData: FormData,
): Promise<ActionState<User>> {
  try {
    const currentUser = await api.me();
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '')
      .trim()
      .toLowerCase();
    let user = currentUser;
    if (name !== currentUser.name)
      user = { ...user, ...(await api.updateName(name)) };
    if (email !== currentUser.email) {
      const password = String(formData.get('currentPassword') ?? '');
      if (!password)
        return {
          error: 'Enter your current password to change your email address.',
        };
      user = {
        ...user,
        ...(await api.updateEmail(currentUser.email, email, password)),
      };
    }
    if (user.name === currentUser.name && user.email === currentUser.email) {
      return { error: 'Make at least one change before saving.' };
    }
    return {
      message: 'Your profile has been updated successfully.',
      data: user,
    };
  } catch (reason) {
    return failure(reason, 'Unable to update profile.');
  }
}

export async function changePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get('newPassword') ?? '');
  const confirmation = String(formData.get('confirmation') ?? '');
  if (password !== confirmation)
    return { error: 'The new password and confirmation must match.' };
  try {
    const user = await api.me();
    await api.updatePassword(
      user.email,
      String(formData.get('currentPassword') ?? ''),
      password,
      confirmation,
    );
  } catch (reason) {
    return failure(reason, 'Unable to change password.');
  }
  redirect('/profile');
}
