import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { Card } from '@/components/ui/card';
import Logo from '@/components/logo';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <header className="flex items-center justify-between border-b border-[#e5e7ef] px-10 py-5">
        <Link href="/login">
          <Logo />
        </Link>
        <Link
          href="/login"
          className="text-[15px] font-semibold text-indigo-600"
        >
          Login
        </Link>
      </header>
      <main className="flex justify-center px-5 py-25">
        <Card className="w-90 px-9.5 pt-9 pb-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <ForgotPasswordForm />
        </Card>
      </main>
    </div>
  );
}
