'use client';

import { useActionState } from 'react';
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
import { signupAction } from '@/app/_actions/auth';
import { initialActionState } from '@/app/_actions/types';
const control = 'flex items-center gap-2.5 rounded-lg bg-[#f0f1f6] px-3.5';

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialActionState,
  );

  return (
    <>
      <FormMessage>{state.error}</FormMessage>
      <form action={formAction} className="text-left">
        <input type="hidden" name="agree" value="true" />
        <FieldGroup className="gap-4.5">
          <Field>
            <FieldLabel htmlFor="name" className="text-[13px] font-bold">
              Full Name
            </FieldLabel>
            <div className={control}>
              <UserRound className="size-3.75 text-[#6b7280]" />
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                className="border-0 bg-transparent px-0 focus-visible:ring-0"
                required
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
                name="email"
                type="email"
                placeholder="you@example.com"
                className="border-0 bg-transparent px-0 focus-visible:ring-0"
                required
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
                name="password"
                placeholder="••••••••"
                className="border-0 bg-transparent pr-10 pl-0 focus-visible:ring-0"
                required
                minLength={8}
                maxLength={72}
              />
            </div>
            <FieldDescription className="text-xs font-semibold">
              Must be at least 8 characters.
            </FieldDescription>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          disabled={isPending}
          className="mt-5.5 mb-5 h-12 w-full bg-indigo-600 text-[15px] font-bold hover:bg-indigo-700"
        >
          {isPending ? 'Creating...' : 'Create Account'}
          <ArrowRight />
        </Button>
      </form>
    </>
  );
}
