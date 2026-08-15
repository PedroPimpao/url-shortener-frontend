import Link from 'next/link';
import { LoginForm } from '@/components/forms/login-form';
import { Card } from '@/components/ui/card';
import Logo from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <header className="border-b border-[#e5e7ef] bg-white px-10 py-5">
        <Link href="/login">
          <Logo />
        </Link>
      </header>
      <main className="flex justify-center px-5 py-22.5">
        <Card className="w-90 border-0 px-10 pt-9 pb-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <h1 className="mb-2.5 text-[22px] font-bold">Welcome Back</h1>
          <p className="mb-6.5 text-sm leading-5 text-[#6b7280]">
            Enter your credentials to access your dashboard.
          </p>
          <LoginForm />
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
