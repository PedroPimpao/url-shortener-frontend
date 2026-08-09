'use client';

import { useState, type SubmitEvent } from 'react';
import { LockKeyhole, UserRound } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthenticatedUser } from '@/hooks/use-authenticated-user';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, setUser, loading } = useAuthenticatedUser();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const formElement = event.currentTarget;
    setError('');
    setMessage('');
    setSaving(true);
    const form = new FormData(formElement);
    const name = String(form.get('name'));
    const email = String(form.get('email'));
    try {
      let next = { ...user };
      if (name.trim() !== user.name) {
        const result = await api.updateName(name.trim());
        next = { ...next, name: result.name };
      }
      if (email.trim().toLowerCase() !== user.email) {
        const currentPassword = String(form.get('current-password'));
        if (!currentPassword)
          throw new Error('Current password is required to update your email.');
        const result = await api.updateEmail(
          user.email,
          email.trim().toLowerCase(),
          currentPassword,
        );
        next = { ...next, email: result.email };
      }
      const currentPassword = String(form.get('current-password'));
      const password = String(form.get('new-password'));
      const confirmation = String(form.get('confirm-password'));
      if (password || confirmation) {
        if (!currentPassword) throw new Error('Current password is required.');
        await api.updatePassword(
          next.email,
          currentPassword,
          password,
          confirmation,
        );
      }
      setUser(next);
      setMessage('Profile updated successfully.');
      formElement.reset();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to update profile.',
      );
    } finally {
      setSaving(false);
    }
  }
  const initials = (user?.name || 'User')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AppHeader />
      <main className="mx-auto max-w-318.75 px-5 py-8 pb-15 md:px-10">
        <div>
          <h1 className="mb-1.5 text-[34px] font-extrabold">My Profile</h1>
          <p className="mb-7 text-[15px] text-[#6b7280]">
            Manage your account settings and preferences.
          </p>
        </div>
        <FormMessage>{error}</FormMessage>
        <FormMessage success>{message}</FormMessage>
        {loading ? (
          <p className="py-20 text-center text-[#8b8fa3]">Loading profile...</p>
        ) : (
          <form onSubmit={save}>
            <div className="flex flex-col items-start gap-6 lg:flex-row">
              <div className="flex flex-[1.7] flex-col gap-6">
                <Card className="px-8 py-7">
                  <h2 className="mb-5 flex items-center gap-2 text-[19px] font-bold">
                    <UserRound className="size-4.25 text-indigo-600" />
                    Profile Details
                  </h2>
                  <div className="mb-4.5">
                    <label
                      htmlFor="name"
                      className="mb-2 block text-[13px] font-bold"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={user?.name}
                      minLength={2}
                      maxLength={120}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[13px] font-bold"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user?.email}
                      required
                    />
                  </div>
                </Card>
                <Card className="px-8 py-7">
                  <h2 className="mb-5 flex items-center gap-2 text-[19px] font-bold">
                    <LockKeyhole className="size-4.25 text-indigo-600" />
                    Change Password
                  </h2>
                  <div className="mb-4.5">
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
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
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
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="confirm-password"
                        className="mb-2 block text-[13px] font-bold"
                      >
                        Confirm New Password
                      </label>
                      <Input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        minLength={8}
                        maxLength={72}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <aside className="w-full flex-1 rounded-xl border border-[#dcdff8] bg-[#e6e9fb] px-7 py-8 text-center">
                <div className="mx-auto mb-4 flex size-18 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
                  {initials}
                </div>
                <h3 className="mb-1 text-[19px] font-bold">{user?.name}</h3>
                <p className="mb-5 text-sm text-[#6b7280]">
                  Link Precision User
                </p>
                <div className="border-t border-[#cfd3f2] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4a4f5c]">Account</span>
                    <span className="font-bold">Active</span>
                  </div>
                </div>
              </aside>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="reset"
                variant="outline"
                className="h-11 border-[#d8dae5] px-5.5"
                onClick={() => {
                  setError('');
                  setMessage('');
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-11 bg-indigo-600 px-5.5 hover:bg-indigo-700"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
