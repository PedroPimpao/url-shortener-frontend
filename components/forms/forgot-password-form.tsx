'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { api } from '@/lib/api';

type Step = 'request' | 'verify' | 'complete' | 'done';
type ForgotPasswordValues = {
  email: string;
  otp: string;
  password: string;
  confirmation: string;
};

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordValues>();

  async function submit(values: ForgotPasswordValues) {
    setError('');
    setMessage('');
    try {
      if (step === 'request') {
        const normalizedEmail = values.email.trim().toLowerCase();
        const result = await api.requestPasswordReset(normalizedEmail);
        setEmail(normalizedEmail);
        setMessage(result.otp ? `Study OTP: ${result.otp}` : result.message);
        setStep('verify');
      } else if (step === 'verify') {
        const result = await api.verifyPasswordReset(email, values.otp);
        setToken(result.reset_token);
        setStep('complete');
      } else if (step === 'complete') {
        if (values.password !== values.confirmation) {
          setError('The new password and confirmation must match.');
          return;
        }
        await api.completePasswordReset(
          token,
          values.password,
          values.confirmation,
        );
        setMessage('Password reset successfully.');
        setStep('done');
      }
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to reset password.',
      );
    }
  }

  const title =
    step === 'request'
      ? 'Reset your password'
      : step === 'verify'
        ? 'Enter recovery code'
        : step === 'complete'
          ? 'Choose a new password'
          : 'Password updated';
  const description =
    step === 'request'
      ? "Enter your email address and we'll send you a link to reset your password."
      : step === 'verify'
        ? `Enter the six-digit code generated for ${email}.`
        : step === 'complete'
          ? 'Create a secure password with at least 8 characters.'
          : 'You can now sign in with your new password.';

  return (
    <>
      <div className="mx-auto mb-4.5 flex size-12 items-center justify-center text-indigo-600">
        {step === 'complete' ? (
          <KeyRound className="size-7" />
        ) : (
          <LockKeyhole className="size-7" />
        )}
      </div>
      <h1 className="mb-2.5 text-[22px] font-bold">{title}</h1>
      <p className="mb-6.5 text-sm leading-5 text-[#6b7280]">{description}</p>
      <FormMessage>{error}</FormMessage>
      <FormMessage success>{message}</FormMessage>
      {step !== 'done' && (
        <form onSubmit={handleSubmit(submit)} className="text-left">
          <FieldGroup className="gap-4.5">
            {step === 'request' && (
              <Field>
                <FieldLabel htmlFor="email" className="text-[13px] font-bold">
                  Email Address
                </FieldLabel>
                <div className="rounded-lg bg-[#eef0f5] px-3.5">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="border-0 bg-transparent px-0 focus-visible:ring-0"
                    {...register('email', { required: true })}
                  />
                </div>
              </Field>
            )}
            {step === 'verify' && (
              <Field>
                <FieldLabel htmlFor="otp" className="text-[13px] font-bold">
                  Recovery Code
                </FieldLabel>
                <div className="rounded-lg bg-[#eef0f5] px-3.5">
                  <Input
                    id="otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    className="border-0 bg-transparent px-0 text-center tracking-[0.4em] focus-visible:ring-0"
                    {...register('otp', {
                      required: true,
                      pattern: /^[0-9]{6}$/,
                    })}
                  />
                </div>
              </Field>
            )}
            {step === 'complete' && (
              <>
                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="text-[13px] font-bold"
                  >
                    New Password
                  </FieldLabel>
                  <PasswordInput
                    id="password"
                    {...register('password', {
                      required: true,
                      minLength: 8,
                      maxLength: 72,
                    })}
                  />
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
                    {...register('confirmation', {
                      required: true,
                      minLength: 8,
                      maxLength: 72,
                    })}
                  />
                </Field>
              </>
            )}
          </FieldGroup>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-5.5 mb-5 h-12 w-full bg-indigo-600 text-[15px] font-semibold hover:bg-indigo-700"
          >
            {isSubmitting
              ? 'Please wait...'
              : step === 'request'
                ? 'Send Recovery Code'
                : step === 'verify'
                  ? 'Verify Code'
                  : 'Reset Password'}
            <ArrowRight />
          </Button>
        </form>
      )}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-indigo-700"
      >
        <ArrowLeft className="size-4" />
        Back to login
      </Link>
    </>
  );
}
