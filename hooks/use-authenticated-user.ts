'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/api';
import { getCurrentUserAction } from '@/app/_actions/user';

export function useAuthenticatedUser() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCurrentUserAction()
      .then((currentUser) => {
        if (!currentUser) router.replace('/login');
        else setUser(currentUser);
      })
      .finally(() => setLoading(false));
  }, [router]);
  return { user, setUser, loading };
}
