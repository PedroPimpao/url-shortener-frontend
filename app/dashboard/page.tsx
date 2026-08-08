'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  CalendarDays,
  Clipboard,
  Grid2X2,
  Link2,
  List,
  QrCode,
  Scissors,
  SlidersHorizontal,
} from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api, ApiError, type ShortUrl } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const loadUrls = useCallback(async () => {
    try {
      const result = await api.listUrls();
      setUrls(result.urls);
    } catch (reason) {
      if (!(reason instanceof ApiError && reason.status === 404))
        setError(
          reason instanceof Error ? reason.message : 'Unable to load links.',
        );
    }
  }, []);
  useEffect(() => {
    api
      .me()
      .then(() => api.listUrls())
      .then((result) => setUrls(result.urls))
      .catch((reason) => {
        if (reason instanceof ApiError && reason.status === 401) {
          router.replace('/login');
        } else if (!(reason instanceof ApiError && reason.status === 404)) {
          setError(
            reason instanceof Error ? reason.message : 'Unable to load links.',
          );
        }
      })
      .finally(() => setAuthLoading(false));
  }, [router]);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setCreating(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await api.createShortUrl(String(data.get('url')).trim());
      form.reset();
      await loadUrls();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to shorten URL.',
      );
    } finally {
      setCreating(false);
    }
  }
  async function qr(code: string) {
    try {
      const result = await api.generateQrCode(code);
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${result.qrcode}`;
      link.download = `${code}-qrcode.png`;
      link.click();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to generate QR Code.',
      );
    }
  }
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AppHeader />
      <main className="mx-auto flex max-w-[1275px] flex-col gap-6 px-5 py-8 lg:flex-row lg:px-10">
        <Card className="min-h-[580px] flex-1 border-0 px-8 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <h1 className="mb-3 text-2xl font-bold">Shorten a Long Link</h1>
          <p className="mx-auto mb-7 max-w-[380px] text-[15px] leading-[22px] text-[#6b7280]">
            Paste your long URL below to create a concise, trackable link.
          </p>
          <FormMessage>{error}</FormMessage>
          <form onSubmit={create}>
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-[#e0e2ea] bg-[#f9fafc] px-3.5">
              <Link2 className="size-4 text-[#9aa0ad]" />
              <Input
                name="url"
                type="url"
                required
                placeholder="https://very-long-url.com/path/to/something"
                className="border-0 bg-transparent px-0 focus-visible:ring-0"
              />
            </div>
            <Button
              disabled={creating}
              className="h-12 w-full bg-indigo-600 text-[15px] font-semibold hover:bg-indigo-700"
            >
              <Scissors />
              {creating ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>
        </Card>
        <Card className="flex-[1.4] border-0 px-5 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:px-9">
          <div className="mb-5 flex items-center justify-between border-b border-[#eceef4] pb-5">
            <h2 className="text-xl font-bold">My Shortened Links</h2>
            <div className="flex gap-3.5 text-[#9aa0ad]">
              <List className="size-4" />
              <SlidersHorizontal className="size-4" />
            </div>
          </div>
          {authLoading ? (
            <p className="py-16 text-center text-sm text-[#9aa0ad]">
              Loading links...
            </p>
          ) : (
            urls.map((item, index) => (
              <article
                key={item['short-code']}
                className="mb-4 rounded-[10px] border border-[#eceef4] px-5 py-[18px]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold">
                    {item.title || `Shortened Link ${index + 1}`}
                  </h3>
                  <span className="rounded-full bg-[#e7e9fb] px-2.5 py-1 text-[11px] font-bold tracking-[0.3px] text-indigo-600 uppercase">
                    Link
                  </span>
                </div>
                <div className="mb-2.5 flex items-center justify-between rounded-lg bg-[#f2f3fc] px-3.5 py-2.5">
                  <span className="text-[15px] font-semibold text-indigo-600">
                    {item['short-code']}
                  </span>
                  <button
                    aria-label="Copy short code"
                    onClick={() =>
                      navigator.clipboard.writeText(item['short-code'])
                    }
                  >
                    <Clipboard className="size-4 text-indigo-600" />
                  </button>
                </div>
                <div className="mb-3.5 flex items-center gap-1.5 text-[13px] break-all text-[#8b8fa3]">
                  <Link2 className="size-3.5 shrink-0" />
                  {item['original-url']}
                </div>
                <div className="flex items-center justify-between text-[13px] text-[#8b8fa3]">
                  <div className="flex gap-[18px]">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="size-3.5" />
                      {item.clicks} clicks
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      Today
                    </span>
                  </div>
                  <button
                    onClick={() => qr(item['short-code'])}
                    className="flex items-center gap-1 font-semibold text-indigo-600"
                  >
                    <QrCode className="size-4" />
                    QR Code
                  </button>
                </div>
              </article>
            ))
          )}
          {!authLoading && urls.length === 0 && (
            <div className="rounded-[10px] border-2 border-dashed border-[#d8dae5] py-10 text-center text-[#b0b3c0]">
              <div className="mb-2.5 flex justify-center">
                <Grid2X2 className="size-[22px]" />
              </div>
              <p className="text-sm">No links found.</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
