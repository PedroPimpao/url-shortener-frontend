'use client';

import { useState, type SubmitEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AtSign,
  LockKeyhole,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthenticatedUser } from '@/hooks/use-authenticated-user';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, setUser, loading } = useAuthenticatedUser();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function startEditing() {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setError('');
    setMessage('');
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setError('');
  }

  async function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const nameChanged = normalizedName !== user.name;
    const emailChanged = normalizedEmail !== user.email;

    if (!nameChanged && !emailChanged) {
      setError('Make at least one change before saving.');
      return;
    }

    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get('current-password'));
    if (emailChanged && !currentPassword) {
      setError('Enter your current password to change your email address.');
      return;
    }

    setError('');
    setMessage('');
    setSaving(true);
    try {
      let nextUser = { ...user };
      if (nameChanged) {
        const result = await api.updateName(normalizedName);
        nextUser = { ...nextUser, name: result.name };
      }
      if (emailChanged) {
        const result = await api.updateEmail(
          user.email,
          normalizedEmail,
          currentPassword,
        );
        nextUser = { ...nextUser, email: result.email };
      }
      setUser(nextUser);
      setEditing(false);
      setMessage('Your profile has been updated successfully.');
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
  const emailChanged = Boolean(
    user && email.trim().toLowerCase() !== user.email,
  );

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-5 py-8 pb-15 md:px-10">
        <div className="mb-8">
          <h1 className="mb-1.5 text-[34px] font-extrabold">My Profile</h1>
          <p className="text-[15px] text-[#6b7280]">
            Review your personal information and account security.
          </p>
        </div>

        <FormMessage>{error}</FormMessage>
        <FormMessage success>{message}</FormMessage>

        {loading ? (
          <p className="py-20 text-center text-[#8b8fa3]">Loading profile...</p>
        ) : (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="flex flex-col gap-5 bg-[#eef0ff] px-6 py-7 sm:flex-row sm:items-center">
                <div className="flex size-18 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-2xl font-bold">{user?.name}</h2>
                  <p className="mt-1 truncate text-sm text-[#6b7280]">
                    {user?.email}
                  </p>
                </div>
                {!editing && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-indigo-200 bg-white px-4 text-indigo-700 hover:bg-indigo-50"
                    onClick={startEditing}
                  >
                    <Pencil />
                    Edit profile
                  </Button>
                )}
              </div>

              {editing ? (
                <form onSubmit={save} className="px-6 py-7">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        Edit personal information
                      </h3>
                      <p className="mt-1 text-sm text-[#6b7280]">
                        Update the details associated with your account.
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Cancel editing"
                      className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f3f4f8]"
                      onClick={cancelEditing}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-[13px] font-bold"
                      >
                        Full Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        minLength={2}
                        maxLength={120}
                        required
                        onChange={(event) => setName(event.target.value)}
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
                        type="email"
                        value={email}
                        required
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  </div>
                  {emailChanged && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <label
                        htmlFor="current-password"
                        className="mb-2 block text-[13px] font-bold text-amber-950"
                      >
                        Current Password
                      </label>
                      <Input
                        id="current-password"
                        name="current-password"
                        type="password"
                        required
                        autoComplete="current-password"
                        placeholder="Confirm your identity"
                        className="bg-white"
                      />
                      <p className="mt-2 text-xs leading-5 text-amber-800">
                        For your security, changing your email requires your
                        current password.
                      </p>
                    </div>
                  )}
                  <div className="mt-6 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-4"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="h-10 bg-indigo-600 px-5 hover:bg-indigo-700"
                    >
                      {saving ? 'Saving...' : 'Save changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-6 px-6 py-7 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <UserRound className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-wide text-[#8b8fa3] uppercase">
                        Full name
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold">
                        {user?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Mail className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-wide text-[#8b8fa3] uppercase">
                        Email address
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="px-6 py-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="size-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">Password and security</h2>
                  <p className="mt-1 text-sm leading-5 text-[#6b7280]">
                    Use a strong, unique password to keep your account
                    protected.
                  </p>
                </div>
                <Button
                  nativeButton={false}
                  render={<Link href="/profile/change-password" />}
                  variant="outline"
                  className="h-10 border-[#d8dae5] px-4"
                >
                  <LockKeyhole />
                  Change password
                  <ArrowRight />
                </Button>
              </div>
            </Card>

            <Card className="px-6 py-6">
              <div className="flex items-center gap-3 text-sm text-[#6b7280]">
                <AtSign className="size-5 text-indigo-600" />
                <span>
                  Account ID:{' '}
                  <strong className="font-semibold text-[#1f2430]">
                    {user?.id}
                  </strong>
                </span>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
