'use client';

import Link from 'next/link';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { ChangePasswordForm } from '@/components/forms/change-password-form';
import { Card } from '@/components/ui/card';
import { useAuthenticatedUser } from '@/hooks/use-authenticated-user';

export default function ChangePasswordPage() {
  const { user, loading } = useAuthenticatedUser();
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-5 py-8 pb-15 md:px-10">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-indigo-700"
        >
          <ArrowLeft className="size-4" />
          Back to profile
        </Link>
        <div className="mb-7">
          <h1 className="mb-1.5 text-[34px] font-extrabold">Change Password</h1>
          <p className="text-[15px] text-[#6b7280]">
            Confirm your current password, then choose a new secure password.
          </p>
        </div>
        {loading ? (
          <p className="py-20 text-center text-[#8b8fa3]">Loading account...</p>
        ) : (
          user && (
            <Card className="overflow-hidden">
              <div className="flex items-center gap-4 border-b border-[#e5e7ef] bg-[#eef0ff] px-6 py-5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h2 className="font-bold">Update your password</h2>
                  <p className="mt-0.5 text-sm text-[#6b7280]">
                    Signed in as {user.email}
                  </p>
                </div>
              </div>
              <ChangePasswordForm />
            </Card>
          )
        )}
      </main>
    </div>
  );
}
