'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CodeXml,
  Globe2,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

const field = 'flex items-center gap-2.5 rounded-lg bg-[#f0f1f6] px-3.5';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await api.createAccount({
        name: String(form.get('name')).trim(),
        email: String(form.get('email')).trim().toLowerCase(),
        password: String(form.get('password')),
      });
      router.push('/login');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to create account.',
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#e9ecfb_0%,#eef1fb_50%,#e4e9fa_100%)] px-5 py-10">
      <Card className="w-[360px] border-0 px-10 pt-10 pb-8 text-center shadow-[0_4px_20px_rgba(60,60,120,0.08)]">
        <h1 className="mb-3 text-[32px] font-extrabold text-indigo-700">
          Link Precision
        </h1>
        <p className="mb-[26px] text-sm text-[#6b7280]">
          Create your account to start managing links.
        </p>
        <FormMessage>{error}</FormMessage>
        <form onSubmit={submit} className="text-left">
          <label htmlFor="name" className="mb-2 block text-[13px] font-bold">
            Full Name
          </label>
          <div className={`${field} mb-[18px]`}>
            <UserRound className="size-[15px] text-[#6b7280]" />
            <Input
              id="name"
              name="name"
              required
              placeholder="John Doe"
              className="border-0 bg-transparent px-0 focus-visible:ring-0"
            />
          </div>
          <label htmlFor="email" className="mb-2 block text-[13px] font-bold">
            Email Address
          </label>
          <div className={`${field} mb-[18px]`}>
            <Mail className="size-[15px] text-[#6b7280]" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="border-0 bg-transparent px-0 focus-visible:ring-0"
            />
          </div>
          <label
            htmlFor="password"
            className="mb-2 block text-[13px] font-bold"
          >
            Password
          </label>
          <div className={field}>
            <LockKeyhole className="size-[15px] text-[#6b7280]" />
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              maxLength={72}
              required
              placeholder="••••••••"
              className="border-0 bg-transparent px-0 focus-visible:ring-0"
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#6b7280]">
            Must be at least 8 characters.
          </p>
          <Button
            disabled={loading}
            className="mt-[22px] mb-5 h-12 w-full bg-indigo-600 text-[15px] font-bold hover:bg-indigo-700"
          >
            {loading ? 'Creating...' : 'Create Account'}
            <ArrowRight />
          </Button>
        </form>
        <p className="mb-[22px] text-sm text-[#4a4f5c]">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-indigo-600 underline">
            Log in
          </Link>
        </p>
        <div className="mb-5 flex items-center gap-3.5 text-[13px] font-semibold text-[#6b7280] before:h-px before:flex-1 before:bg-[#e0e2ea] after:h-px after:flex-1 after:bg-[#e0e2ea]">
          Or continue with
        </div>
        <div className="mb-6 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-11 flex-1 bg-[#f0f1f6]"
          >
            <Globe2 />
            Google
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-11 flex-1 bg-[#f0f1f6]"
          >
            <CodeXml />
            GitHub
          </Button>
        </div>
        <p className="text-xs leading-[18px] text-[#8b8fa3]">
          By clicking &quot;Create Account&quot;, you agree to our{' '}
          <span className="font-semibold text-indigo-600">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="font-semibold text-indigo-600">Privacy Policy</span>.
        </p>
      </Card>
    </main>
  );
}
