'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { loginAction } from '@/app/_actions/auth';
import { initialActionState } from '@/app/_actions/types';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialActionState,
  );

  return (
    <>
      <FormMessage>{state.error}</FormMessage>
      <form action={formAction} className="text-left">
        <FieldGroup className="gap-4.5">
          <Field>
            <FieldLabel htmlFor="email" className="text-[13px] font-bold">
              Email Address
            </FieldLabel>
            <div className="flex items-center gap-2.5 rounded-lg bg-[#eaeefb] px-3.5">
              <Mail className="size-3.75 text-[#6b7280]" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="border-0 bg-transparent pr-10 pl-0 shadow-none focus-visible:ring-0"
                required
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
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                required
              />
            </div>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          disabled={isPending}
          className="mt-6 mb-5 h-12 w-full bg-indigo-600 text-[15px] font-semibold hover:bg-indigo-700"
        >
          {isPending ? 'Signing In...' : 'Sign In'}
          <ArrowRight />
        </Button>
      </form>
    </>
  );
}
