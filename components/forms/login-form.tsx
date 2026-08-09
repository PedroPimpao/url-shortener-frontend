'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/session';

type LoginValues = { email: string; password: string };

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>();

  async function submit(values: LoginValues) {
    setError('');
    try {
      const tokens = await api.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      saveSession(tokens.access_token, tokens.refresh_token);
      router.replace('/dashboard');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.');
    }
  }

  return (
    <>
      <FormMessage>{error}</FormMessage>
      <form onSubmit={handleSubmit(submit)} className="text-left">
        <FieldGroup className="gap-4.5">
          <Field>
            <FieldLabel htmlFor="email" className="text-[13px] font-bold">
              Email Address
            </FieldLabel>
            <div className="flex items-center gap-2.5 rounded-lg bg-[#eaeefb] px-3.5">
              <Mail className="size-3.75 text-[#6b7280]" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="border-0 bg-transparent pr-10 pl-0 shadow-none focus-visible:ring-0"
                {...register('email', { required: true })}
              />
            </div>
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password" className="text-[13px] font-bold">
                Password
              </FieldLabel>
              <Link
                href="/forgot-password"
                className="text-[13px] font-semibold text-indigo-600"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg bg-[#eaeefb] px-3.5">
              <LockKeyhole className="size-3.75 text-[#6b7280]" />
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                {...register('password', { required: true })}
              />
            </div>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 mb-5 h-12 w-full bg-indigo-600 text-[15px] font-semibold hover:bg-indigo-700"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
          <ArrowRight />
        </Button>
      </form>
    </>
  );
}
