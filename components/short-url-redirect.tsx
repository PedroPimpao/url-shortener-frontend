'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CircleAlert, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { accessUrlAction } from '@/app/_actions/urls';

export function ShortUrlRedirect({ code }: { code: string }) {
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);
  const processedCode = useRef<string | null>(null);

  useEffect(() => {
    if (processedCode.current === code) return;
    processedCode.current = code;

    accessUrlAction(code).then((result) => {
      if (result.data?.url) window.location.replace(result.data.url);
      else {
        setUnauthorized(Boolean(result.data?.unauthorized));
        setError(result.error ?? 'Unable to access this shortened link.');
      }
    });
  }, [code]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6fa] px-5">
      <Card className="w-full max-w-md px-8 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {error ? (
          <>
            <CircleAlert className="mx-auto mb-4 size-10 text-red-500" />
            <h1 className="mb-2 text-xl font-bold">Unable to open link</h1>
            <p className="mb-6 text-sm leading-5 text-[#6b7280]">{error}</p>
            <Button
              nativeButton={false}
              render={<Link href={unauthorized ? '/login' : '/dashboard'} />}
              className="h-10 bg-indigo-600 px-5 hover:bg-indigo-700"
            >
              {unauthorized ? 'Sign in' : 'Back to dashboard'}
            </Button>
          </>
        ) : (
          <>
            <LoaderCircle className="mx-auto mb-4 size-10 animate-spin text-indigo-600" />
            <h1 className="mb-2 text-xl font-bold">Opening your link</h1>
            <p className="text-sm text-[#6b7280]">
              You will be redirected automatically.
            </p>
          </>
        )}
      </Card>
    </main>
  );
}
