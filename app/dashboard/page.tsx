'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SubmitEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  BarChart3,
  CalendarDays,
  Check,
  Clipboard,
  Download,
  Grid2X2,
  Link2,
  List,
  LoaderCircle,
  Pencil,
  QrCode,
  Scissors,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api, ApiError, type ShortUrl } from '@/lib/api';
import { getShortUrl, getShortUrlPath } from '@/lib/short-url';

export default function DashboardPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [generatingQrCode, setGeneratingQrCode] = useState<string | null>(null);
  const copyFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  useEffect(() => {
    return () => {
      if (copyFeedbackTimer.current) clearTimeout(copyFeedbackTimer.current);
    };
  }, []);
  async function create(event: SubmitEvent<HTMLFormElement>) {
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
  async function generateQrCode(code: string) {
    setError('');
    setGeneratingQrCode(code);
    try {
      const result = await api.generateQrCode(code);
      const imageSource = result.qrcode.startsWith('data:')
        ? result.qrcode
        : `data:image/png;base64,${result.qrcode}`;
      setQrCodes((currentQrCodes) => ({
        ...currentQrCodes,
        [code]: imageSource,
      }));
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to generate QR Code.',
      );
    } finally {
      setGeneratingQrCode(null);
    }
  }
  function downloadQrCode(code: string) {
    const imageSource = qrCodes[code];
    if (!imageSource) return;

    const link = document.createElement('a');
    link.href = imageSource;
    link.download = `${code}-qrcode.png`;
    link.click();
  }
  async function copyShortUrl(code: string) {
    try {
      await navigator.clipboard.writeText(getShortUrl(code));
      setCopiedCode(code);
      if (copyFeedbackTimer.current) clearTimeout(copyFeedbackTimer.current);
      copyFeedbackTimer.current = setTimeout(() => {
        setCopiedCode(null);
        copyFeedbackTimer.current = null;
      }, 1000);
    } catch {
      setError('Unable to copy the shortened URL.');
    }
  }
  function startEditingTitle(item: ShortUrl, fallbackTitle: string) {
    setEditingCode(item['short-code']);
    setEditingTitle(item.title || fallbackTitle);
    setError('');
  }
  function cancelEditingTitle() {
    setEditingCode(null);
    setEditingTitle('');
  }
  async function updateTitle(
    event: SubmitEvent<HTMLFormElement>,
    code: string,
  ) {
    event.preventDefault();
    const title = editingTitle.trim();
    if (!title) return;

    setSavingTitle(true);
    setError('');
    try {
      const result = await api.updateUrlTitle(code, title);
      setUrls((currentUrls) =>
        currentUrls.map((item) =>
          item['short-code'] === code
            ? { ...item, title: result['new-title'] }
            : item,
        ),
      );
      cancelEditingTitle();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Unable to update title.',
      );
    } finally {
      setSavingTitle(false);
    }
  }
  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <AppHeader />
      <main className="mx-auto flex max-w-318.75 flex-col gap-6 px-5 py-8 lg:flex-row lg:px-10">
        <Card className="min-h-145 flex-1 border-0 px-8 py-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <h1 className="mb-3 text-2xl font-bold">Shorten a Long Link</h1>
          <p className="mx-auto mb-7 max-w-95 text-[15px] leading-5.5 text-[#6b7280]">
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
              type="submit"
              disabled={creating}
              className="h-12 w-full bg-indigo-600 text-[15px] font-semibold hover:bg-indigo-700"
            >
              <Scissors />
              {creating ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>
        </Card>
        <Card className="flex h-145 max-h-[calc(100vh-2rem)] flex-[1.4] flex-col overflow-hidden border-0 px-5 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:px-9 lg:max-h-[calc(100vh-9rem)]">
          <div className="mb-5 flex shrink-0 items-center justify-between border-b border-[#eceef4] pb-5">
            <h2 className="text-xl font-bold">My Shortened Links</h2>
            <div className="flex gap-3.5 text-[#9aa0ad]">
              <List className="size-4" />
              <SlidersHorizontal className="size-4" />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            {authLoading ? (
              <p className="py-16 text-center text-sm text-[#9aa0ad]">
                Loading links...
              </p>
            ) : (
              urls.map((item, index) => (
                <article
                  key={item['short-code']}
                  className="mb-4 rounded-[10px] border border-[#eceef4] px-5 py-4.5"
                >
                  {editingCode === item['short-code'] ? (
                    <form
                      onSubmit={(event) =>
                        updateTitle(event, item['short-code'])
                      }
                      className="mb-3 flex items-center gap-2"
                    >
                      <Input
                        value={editingTitle}
                        required
                        autoFocus
                        aria-label="URL title"
                        className="h-9 flex-1"
                        onChange={(event) =>
                          setEditingTitle(event.target.value)
                        }
                      />
                      <button
                        type="submit"
                        disabled={savingTitle}
                        aria-label="Save title"
                        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        type="button"
                        disabled={savingTitle}
                        aria-label="Cancel title editing"
                        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-[#d8dae5] text-[#6b7280] hover:bg-[#f5f6fa] disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={cancelEditingTitle}
                      >
                        <X className="size-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="min-w-0 truncate font-semibold">
                        {item.title || `Shortened Link ${index + 1}`}
                      </h3>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full bg-[#e7e9fb] px-2.5 py-1 text-[11px] font-bold tracking-[0.3px] text-indigo-600 uppercase">
                          Link
                        </span>
                        <button
                          type="button"
                          aria-label={`Edit title for ${item.title || `Shortened Link ${index + 1}`}`}
                          className="grid size-7 cursor-pointer place-items-center rounded-lg text-[#8b8fa3] hover:bg-indigo-50 hover:text-indigo-600"
                          onClick={() =>
                            startEditingTitle(
                              item,
                              `Shortened Link ${index + 1}`,
                            )
                          }
                        >
                          <Pencil className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="mb-2.5 flex items-center justify-between rounded-lg bg-[#f2f3fc] px-3.5 py-2.5">
                    <Link
                      href={getShortUrlPath(item['short-code'])}
                      target="_blank"
                      className="truncate text-[15px] font-semibold text-indigo-600 hover:underline"
                    >
                      {getShortUrl(item['short-code'])}
                    </Link>
                    <button
                      type="button"
                      className="grid size-6 cursor-pointer place-items-center text-indigo-600"
                      aria-label={
                        copiedCode === item['short-code']
                          ? 'Shortened URL copied'
                          : 'Copy shortened URL'
                      }
                      onClick={() => copyShortUrl(item['short-code'])}
                    >
                      {copiedCode === item['short-code'] ? (
                        <Check className="animate-in zoom-in size-4 duration-150" />
                      ) : (
                        <Clipboard className="animate-in fade-in size-4 duration-150" />
                      )}
                    </button>
                  </div>
                  <div className="mb-3.5 flex items-center gap-1.5 text-[13px] break-all text-[#8b8fa3]">
                    <Link2 className="size-3.5 shrink-0" />
                    {item['original-url']}
                  </div>
                  <div className="flex items-center justify-between text-[13px] text-[#8b8fa3]">
                    <div className="flex gap-4.5">
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
                      type="button"
                      disabled={generatingQrCode === item['short-code']}
                      onClick={() => generateQrCode(item['short-code'])}
                      className="flex cursor-pointer items-center gap-1 font-semibold text-indigo-600 disabled:cursor-wait disabled:opacity-60"
                    >
                      {generatingQrCode === item['short-code'] ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <QrCode className="size-4" />
                      )}
                      {generatingQrCode === item['short-code']
                        ? 'Generating...'
                        : qrCodes[item['short-code']]
                          ? 'Regenerate QR Code'
                          : 'QR Code'}
                    </button>
                  </div>
                  {qrCodes[item['short-code']] && (
                    <div className="mt-4 flex flex-col items-center gap-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 sm:flex-row">
                      <div className="shrink-0 rounded-xl bg-white p-2 shadow-sm">
                        <Image
                          src={qrCodes[item['short-code']]}
                          alt={`QR Code for ${getShortUrl(item['short-code'])}`}
                          width={128}
                          height={128}
                          unoptimized
                          className="size-32"
                        />
                      </div>
                      <div className="min-w-0 text-center sm:text-left">
                        <p className="font-semibold text-[#242633]">
                          QR Code ready
                        </p>
                        <p className="mt-1 mb-3 text-xs text-[#6b7280]">
                          Scan it to open your shortened link or download the
                          image.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => downloadQrCode(item['short-code'])}
                          className="border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
                        >
                          <Download className="size-4" />
                          Download PNG
                        </Button>
                      </div>
                    </div>
                  )}
                </article>
              ))
            )}
            {!authLoading && urls.length === 0 && (
              <div className="rounded-[10px] border-2 border-dashed border-[#d8dae5] py-10 text-center text-[#b0b3c0]">
                <div className="mb-2.5 flex justify-center">
                  <Grid2X2 className="size-5.5" />
                </div>
                <p className="text-sm">No links found.</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
