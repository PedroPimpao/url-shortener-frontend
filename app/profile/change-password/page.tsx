'use client';

import { useState, type SubmitEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthenticatedUser } from '@/hooks/use-authenticated-user';
import { api } from '@/lib/api';

export default function ChangePasswordPage() {
  const { user, loading } = useAuthenticatedUser();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const currentPassword = String(form.get('current-password'));
    const newPassword = String(form.get('new-password'));
    const confirmation = String(form.get('confirmation'));

    if (newPassword !== confirmation) {
      setError('The new password and confirmation must match.');
      return;
    }

    setError('');
    setMessage('');
    setSaving(true);
    try {
      await api.updatePassword(
        user.email,
        currentPassword,
        newPassword,
        confirmation,
      );
      formElement.reset();
      setMessage('Your password has been changed successfully.');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to change password.',
      );
    } finally {
      setSaving(false);
    }
  }

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
        <FormMessage>{error}</FormMessage>
        <FormMessage success>{message}</FormMessage>
        {loading ? (
          <p className="py-20 text-center text-[#8b8fa3]">Loading account...</p>
        ) : (
          <Card className="overflow-hidden">
            <div className="flex items-center gap-4 border-b border-[#e5e7ef] bg-[#eef0ff] px-6 py-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <KeyRound className="size-5" />
              </div>
              <div>
                <h2 className="font-bold">Update your password</h2>
                <p className="mt-0.5 text-sm text-[#6b7280]">
                  Signed in as {user?.email}
                </p>
              </div>
            </div>
            <form onSubmit={submit} className="px-6 py-7">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="current-password"
                    className="mb-2 block text-[13px] font-bold"
                  >
                    Current Password
                  </label>
                  <Input
                    id="current-password"
                    name="current-password"
                    type="password"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-[13px] font-bold"
                  >
                    New Password
                  </label>
                  <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    minLength={8}
                    maxLength={72}
                    required
                    autoComplete="new-password"
                  />
                  <p className="mt-2 text-xs text-[#6b7280]">
                    Use between 8 and 72 characters.
                  </p>
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
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                <p className="flex gap-2 text-xs leading-5 text-emerald-800">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  Your password is sent securely and is never displayed or
                  stored by this interface.
                </p>
              </div>
              <div className="mt-7 flex justify-end gap-3">
                <Button
                  nativeButton={false}
                  render={<Link href="/profile" />}
                  variant="outline"
                  className="h-10 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-10 bg-indigo-600 px-5 hover:bg-indigo-700"
                >
                  <LockKeyhole />
                  {saving ? 'Changing...' : 'Change password'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}
