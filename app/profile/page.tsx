'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AtSign,
  LockKeyhole,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { ProfileForm } from '@/components/forms/profile-form';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthenticatedUser } from '@/hooks/use-authenticated-user';
import { UserProfileInfo } from '@/components/user-profile-info';

export default function ProfilePage() {
  const { user, setUser, loading } = useAuthenticatedUser();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  function startEditing() {
    if (!user) return;
    setMessage('');
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
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
      <main className="mx-auto max-w-5xl px-5 py-8 pb-15 md:px-10">
        <div className="mb-8">
          <h1 className="mb-1.5 text-[34px] font-extrabold">My Profile</h1>
          <p className="text-[15px] text-[#6b7280]">
            Review your personal information and account security.
          </p>
        </div>

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
                user && (
                  <ProfileForm
                    user={user}
                    onUpdated={(nextUser) => {
                      setUser(nextUser);
                      setEditing(false);
                      setMessage('Your profile has been updated successfully.');
                    }}
                    onCancel={cancelEditing}
                  />
                )
              ) : (
                <div className="grid gap-6 px-6 py-7 sm:grid-cols-2">
                  <UserProfileInfo
                    icon={<UserRound className="size-5" />}
                    label="Full name"
                    value={user?.name || ''}
                  />
                  <UserProfileInfo
                    icon={<Mail className="size-5" />}
                    label="Email address"
                    value={user?.email || ''}
                  />
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
