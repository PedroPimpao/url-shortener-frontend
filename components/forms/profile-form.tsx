'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { X } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { api, type User } from '@/lib/api';

type ProfileValues = { name: string; email: string; currentPassword: string };

export function ProfileForm({
  user,
  onUpdated,
  onCancel,
}: {
  user: User;
  onUpdated: (user: User) => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProfileValues>({
    defaultValues: { name: user.name, email: user.email, currentPassword: '' },
  });
  const email = useWatch({ control, name: 'email' });
  const emailChanged = email.trim().toLowerCase() !== user.email;

  async function submit(values: ProfileValues) {
    const name = values.name.trim();
    const email = values.email.trim().toLowerCase();
    const nameChanged = name !== user.name;
    if (!nameChanged && !emailChanged) {
      setError('Make at least one change before saving.');
      return;
    }
    if (emailChanged && !values.currentPassword) {
      setError('Enter your current password to change your email address.');
      return;
    }
    setError('');
    setMessage('');
    try {
      let nextUser = { ...user };
      if (nameChanged)
        nextUser = { ...nextUser, name: (await api.updateName(name)).name };
      if (emailChanged)
        nextUser = {
          ...nextUser,
          email: (
            await api.updateEmail(user.email, email, values.currentPassword)
          ).email,
        };
      onUpdated(nextUser);
      setMessage('Your profile has been updated successfully.');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to update profile.',
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="px-6 py-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Edit personal information</h3>
          <p className="mt-1 text-sm text-[#6b7280]">
            Update the details associated with your account.
          </p>
        </div>
        <button
          type="button"
          aria-label="Cancel editing"
          className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f3f4f8]"
          onClick={onCancel}
        >
          <X className="size-4" />
        </button>
      </div>
      <FormMessage>{error}</FormMessage>
      <FormMessage success>{message}</FormMessage>
      <FieldGroup className="grid gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="name" className="text-[13px] font-bold">
            Full Name
          </FieldLabel>
          <Input
            id="name"
            {...register('name', {
              required: true,
              minLength: 2,
              maxLength: 120,
            })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email" className="text-[13px] font-bold">
            Email Address
          </FieldLabel>
          <Input
            id="email"
            type="email"
            {...register('email', { required: true })}
          />
        </Field>
      </FieldGroup>
      {emailChanged && (
        <Field className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <FieldLabel
            htmlFor="current-password"
            className="text-[13px] font-bold text-amber-950"
          >
            Current Password
          </FieldLabel>
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            placeholder="Confirm your identity"
            className="bg-white"
            {...register('currentPassword', { required: emailChanged })}
          />
          <FieldDescription className="text-xs leading-5 text-amber-800">
            For your security, changing your email requires your current
            password.
          </FieldDescription>
        </Field>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 px-4"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 bg-indigo-600 px-5 hover:bg-indigo-700"
        >
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
