'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, KeyRound, LockKeyhole } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

type Step = 'request' | 'verify' | 'complete' | 'done';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      if (step === 'request') {
        const value = String(form.get('email')).trim().toLowerCase();
        const result = await api.requestPasswordReset(value);
        setEmail(value);
        setMessage(result.otp ? `Study OTP: ${result.otp}` : result.message);
        setStep('verify');
      } else if (step === 'verify') {
        const result = await api.verifyPasswordReset(
          email,
          String(form.get('otp')),
        );
        setToken(result.reset_token);
        setStep('complete');
      } else if (step === 'complete') {
        const password = String(form.get('password'));
        const confirmation = String(form.get('confirmation'));
        await api.completePasswordReset(token, password, confirmation);
        setMessage('Password reset successfully.');
        setStep('done');
      }
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to reset password.',
      );
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-[#f5f6fa]">
      <header className="flex items-center justify-between border-b border-[#e5e7ef] px-10 py-5">
        <Link
          href="/login"
          className="text-[26px] font-extrabold text-indigo-700"
        >
          Link Precision
        </Link>
        <nav className="flex gap-8 text-[15px] text-[#6b7280]">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">My Profile</Link>
        </nav>
        <Link
          href="/login"
          className="text-[15px] font-semibold text-indigo-600"
        >
          Login
        </Link>
      </header>
      <main className="flex justify-center px-5 py-[100px]">
        <Card className="w-[360px] px-[38px] pt-9 pb-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="mx-auto mb-[18px] flex size-12 items-center justify-center text-indigo-600">
            {step === 'complete' ? (
              <KeyRound className="size-7" />
            ) : (
              <LockKeyhole className="size-7" />
            )}
          </div>
          <h1 className="mb-2.5 text-[22px] font-bold">{title}</h1>
          <p className="mb-[26px] text-sm leading-5 text-[#6b7280]">
            {description}
          </p>
          <FormMessage>{error}</FormMessage>
          <FormMessage success>{message}</FormMessage>
          {step !== 'done' && (
            <form onSubmit={submit} className="text-left">
              {step === 'request' && (
                <>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[13px] font-bold"
                  >
                    Email Address
                  </label>
                  <div className="mb-[22px] rounded-lg bg-[#eef0f5] px-3.5">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      className="border-0 bg-transparent px-0 focus-visible:ring-0"
                    />
                  </div>
                </>
              )}
              {step === 'verify' && (
                <>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-[13px] font-bold"
                  >
                    Recovery Code
                  </label>
                  <div className="mb-[22px] rounded-lg bg-[#eef0f5] px-3.5">
                    <Input
                      id="otp"
                      name="otp"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      placeholder="123456"
                      className="border-0 bg-transparent px-0 text-center tracking-[0.4em] focus-visible:ring-0"
                    />
                  </div>
                </>
              )}
              {step === 'complete' && (
                <div className="space-y-[18px]">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-[13px] font-bold"
                    >
                      New Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      minLength={8}
                      maxLength={72}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmation"
                      className="mb-2 block text-[13px] font-bold"
                    >
                      Confirm New Password
                    </label>
                    <Input
                      id="confirmation"
                      name="confirmation"
                      type="password"
                      minLength={8}
                      maxLength={72}
                      required
                    />
                  </div>
                </div>
              )}
              <Button
                disabled={loading}
                className="mt-[22px] mb-5 h-12 w-full bg-indigo-600 text-[15px] font-semibold hover:bg-indigo-700"
              >
                {loading
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
        </Card>
      </main>
    </div>
  );
}
