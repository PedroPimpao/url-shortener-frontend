import Link from 'next/link';
import { SignupForm } from '@/components/forms/signup-form';
import { Card } from '@/components/ui/card';
import Logo from '@/components/logo';
import SocialLoginOptions from '@/components/social-login-options';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#e9ecfb_0%,#eef1fb_50%,#e4e9fa_100%)] px-5 py-10">
      <Card className="w-90 border-0 px-10 pt-10 pb-8 text-center shadow-[0_4px_20px_rgba(60,60,120,0.08)]">
        <Logo />
        <p className="mb-6.5 text-sm text-[#6b7280]">
          Create your account to start managing links.
        </p>
        <SignupForm />
        <p className="mb-5.5 text-sm text-[#4a4f5c]">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-indigo-600 underline">
            Log in
          </Link>
        </p>
        <div className="mb-5 flex items-center gap-3.5 text-[13px] font-semibold text-[#6b7280] before:h-px before:flex-1 before:bg-[#e0e2ea] after:h-px after:flex-1 after:bg-[#e0e2ea]">
          Or continue with
        </div>
        <SocialLoginOptions />
        <p className="text-xs leading-4.5 text-[#8b8fa3]">
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
