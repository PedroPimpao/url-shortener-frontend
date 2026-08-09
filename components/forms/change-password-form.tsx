'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { api } from '@/lib/api';

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmation: string;
};

export function ChangePasswordForm({ email }: { email: string }) {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ChangePasswordValues>();

  async function submit(values: ChangePasswordValues) {
    if (values.newPassword !== values.confirmation) {
      setError('The new password and confirmation must match.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await api.updatePassword(
        email,
        values.currentPassword,
        values.newPassword,
        values.confirmation,
      );
      reset();
      setMessage('Your password has been changed successfully.');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to change password.',
      );
    }
  }

  return (
    <>
      <FormMessage>{error}</FormMessage>
      <FormMessage success>{message}</FormMessage>
      <form onSubmit={handleSubmit(submit)} className="px-6 py-7">
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="current-password"
              className="text-[13px] font-bold"
            >
              Current Password
            </FieldLabel>
            <PasswordInput
              id="current-password"
              autoComplete="current-password"
              {...register('currentPassword', { required: true })}
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="new-password"
              className="text-[13px] font-bold"
            >
              New Password
            </FieldLabel>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              {...register('newPassword', {
                required: true,
                minLength: 8,
                maxLength: 72,
              })}
            />
            <FieldDescription className="text-xs">
              Use between 8 and 72 characters.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel
              htmlFor="confirmation"
              className="text-[13px] font-bold"
            >
              Confirm New Password
            </FieldLabel>
            <PasswordInput
              id="confirmation"
              autoComplete="new-password"
              {...register('confirmation', {
                required: true,
                minLength: 8,
                maxLength: 72,
              })}
            />
          </Field>
        </FieldGroup>
        <div className="mt-6 rounded-xl bg-emerald-50 p-4">
          <p className="flex gap-2 text-xs leading-5 text-emerald-800">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            Your password is sent securely and is never displayed or stored by
            this interface.
          </p>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/profile" />}
            variant="outline"
            className="h-10 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 bg-indigo-600 px-5 hover:bg-indigo-700"
          >
            <LockKeyhole />
            {isSubmitting ? 'Changing...' : 'Change password'}
          </Button>
        </div>
      </form>
    </>
  );
}
