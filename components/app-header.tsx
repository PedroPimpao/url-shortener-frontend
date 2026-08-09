'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { clearSession } from '@/lib/session';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-[#e5e7ef] bg-white px-5 md:px-10">
      <Link
        href="/dashboard"
        className="text-[26px] font-extrabold text-indigo-700"
      >
        Link Precision
      </Link>
      <nav className="flex h-20 items-center gap-5 md:gap-8">
        <Link
          href="/dashboard"
          className={cn(
            'flex h-full items-center border-b-2 border-transparent text-[15px] text-[#6b7280]',
            pathname === '/dashboard' &&
              'border-indigo-700 font-semibold text-indigo-700',
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className={cn(
            'flex h-full items-center border-b-2 border-transparent text-[15px] text-[#6b7280]',
            pathname.startsWith('/profile') &&
              'border-indigo-700 font-semibold text-indigo-700',
          )}
        >
          My Profile
        </Link>
      </nav>
      <Button
        variant="outline"
        className="h-9 border-[#d8dae5] px-4.5 font-semibold text-indigo-700"
        onClick={() => {
          clearSession();
          router.replace('/login');
        }}
      >
        Logout
      </Button>
    </header>
  );
}
