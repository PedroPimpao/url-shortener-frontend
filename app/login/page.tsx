'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/session';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const tokens = await api.login({
        email: String(form.get('email')).trim().toLowerCase(),
        password: String(form.get('password')),
      });
      saveSession(tokens.access_token, tokens.refresh_token);
      router.replace('/dashboard');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <header className="border-b border-[#e5e7ef] bg-white px-10 py-5">
        <Link
          href="/login"
          className="text-[26px] font-extrabold text-indigo-700"
        >
          Link Precision
        </Link>
      </header>
      <main className="flex justify-center px-5 py-[90px]">
        <Card className="w-[360px] border-0 px-10 pt-9 pb-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <h1 className="mb-2.5 text-[22px] font-bold">Welcome Back</h1>
          <p className="mb-[26px] text-sm leading-5 text-[#6b7280]">
            Enter your credentials to access your dashboard.
          </p>
          <FormMessage>{error}</FormMessage>
          <form onSubmit={submit} className="text-left">
            <label htmlFor="email" className="mb-2 block text-[13px] font-bold">
              Email Address
            </label>
            <div className="mb-[18px] flex items-center gap-2.5 rounded-lg bg-[#eaeefb] px-3.5">
              <Mail className="size-[15px] text-[#6b7280]" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="text-[13px] font-bold">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] font-semibold text-indigo-600"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="mb-6 flex items-center gap-2.5 rounded-lg bg-[#eaeefb] px-3.5">
              <LockKeyhole className="size-[15px] text-[#6b7280]" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6b7280]"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <Button
              disabled={loading}
              className="mb-5 h-12 w-full bg-indigo-600 text-[15px] font-semibold hover:bg-indigo-700"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight />
            </Button>
          </form>
          <p className="text-sm text-[#4a4f5c]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-indigo-600">
              Sign up
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
