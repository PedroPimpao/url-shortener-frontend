'use client';

import { useActionState } from 'react';
import Link from 'next/link';
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
import { changePasswordAction } from '@/app/_actions/user';
import { initialActionState } from '@/app/_actions/types';

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialActionState,
  );

  return (
    <>
      <FormMessage>{state.error}</FormMessage>
      <FormMessage success>{state.message}</FormMessage>
      <form action={formAction} className="px-6 py-7">
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
              name="currentPassword"
              autoComplete="current-password"
              required
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
              name="newPassword"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
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
              name="confirmation"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
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
            disabled={isPending}
            className="h-10 bg-indigo-600 px-5 hover:bg-indigo-700"
          >
            <LockKeyhole />
            {isPending ? 'Changing...' : 'Change password'}
          </Button>
        </div>
      </form>
    </>
  );
}
