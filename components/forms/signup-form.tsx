'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
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
import { api } from '@/lib/api';

type SignupValues = { name: string; email: string; password: string };
const control = 'flex items-center gap-2.5 rounded-lg bg-[#f0f1f6] px-3.5';

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupValues>();

  async function submit(values: SignupValues) {
    setError('');
    try {
      await api.createAccount({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      router.push('/login');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to create account.',
      );
    }
  }

  return (
    <>
      <FormMessage>{error}</FormMessage>
      <form onSubmit={handleSubmit(submit)} className="text-left">
        <FieldGroup className="gap-4.5">
          <Field>
            <FieldLabel htmlFor="name" className="text-[13px] font-bold">
              Full Name
            </FieldLabel>
            <div className={control}>
              <UserRound className="size-3.75 text-[#6b7280]" />
              <Input
                id="name"
                placeholder="John Doe"
                className="border-0 bg-transparent px-0 focus-visible:ring-0"
                {...register('name', { required: true })}
              />
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="email" className="text-[13px] font-bold">
              Email Address
            </FieldLabel>
            <div className={control}>
              <Mail className="size-3.75 text-[#6b7280]" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="border-0 bg-transparent px-0 focus-visible:ring-0"
                {...register('email', { required: true })}
              />
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="password" className="text-[13px] font-bold">
              Password
            </FieldLabel>
            <div className={control}>
              <LockKeyhole className="size-3.75 text-[#6b7280]" />
              <PasswordInput
                id="password"
                placeholder="••••••••"
                className="border-0 bg-transparent pr-10 pl-0 focus-visible:ring-0"
                {...register('password', {
                  required: true,
                  minLength: 8,
                  maxLength: 72,
                })}
              />
            </div>
            <FieldDescription className="text-xs font-semibold">
              Must be at least 8 characters.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-5.5 mb-5 h-12 w-full bg-indigo-600 text-[15px] font-bold hover:bg-indigo-700"
        >
          {isSubmitting ? 'Creating...' : 'Create Account'}
          <ArrowRight />
        </Button>
      </form>
    </>
  );
}
