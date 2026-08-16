'use client';

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Check,
  Clipboard,
  Download,
  ExternalLink,
  Link2,
  LoaderCircle,
  LogOut,
  QrCode,
  Scissors,
  Search,
  Trophy,
} from 'lucide-react';
import {
  createShortUrlAction,
  generateQrCodeAction,
  listUrlsAction,
} from '@/app/_actions/urls';
import { initialActionState } from '@/app/_actions/types';
import { logoutAction } from '@/app/_actions/auth';
import { FormMessage } from '@/components/form-message';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthenticatedUser } from '@/hooks/use-authenticated-user';
import type { ShortUrl } from '@/lib/api';
import { getShortUrl, getShortUrlPath } from '@/lib/short-url';

type SortMode = 'recent' | 'clicks' | 'oldest' | 'az';

const getInitials = (name?: string) =>
  (name || 'Usuário')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export default function NewDashboardPage() {
  const { user, loading: userLoading } = useAuthenticatedUser();
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [generatingQrCode, setGeneratingQrCode] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [createState, createAction, isCreating] = useActionState(
    createShortUrlAction,
    initialActionState,
  );

  const loadUrls = useCallback(async () => {
    const result = await listUrlsAction();
    if (result.error) setLoadError(result.error);
    else {
      setLoadError('');
      setUrls(result.data ?? []);
    }
    setLoadingUrls(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadUrls());
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, [loadUrls]);

  useEffect(() => {
    if (!createState.message) return;
    formRef.current?.reset();
    queueMicrotask(() => void loadUrls());
  }, [createState.message, loadUrls]);

  const stats = useMemo(() => {
    const totalClicks = urls.reduce((total, item) => total + item.clicks, 0);
    const topLink = urls.reduce<ShortUrl | null>(
      (top, item) => (!top || item.clicks > top.clicks ? item : top),
      null,
    );
    return { totalClicks, topLink };
  }, [urls]);

  const filteredUrls = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = urls.filter((item) =>
      [item.title, item['short-code'], item['original-url']].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );

    return filtered.toSorted((left, right) => {
      if (sortMode === 'clicks') return right.clicks - left.clicks;
      if (sortMode === 'oldest')
        return urls.indexOf(right) - urls.indexOf(left);
      if (sortMode === 'az')
        return left.title.localeCompare(right.title, 'pt-BR');
      return urls.indexOf(left) - urls.indexOf(right);
    });
  }, [query, sortMode, urls]);

  async function copyUrl(code: string) {
    try {
      await navigator.clipboard.writeText(getShortUrl(code));
      setCopiedCode(code);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedCode(null), 1400);
    } catch {
      setLoadError('Não foi possível copiar o link.');
    }
  }

  async function generateQrCode(code: string) {
    setLoadError('');
    setGeneratingQrCode(code);
    try {
      const result = await generateQrCodeAction(code);
      if (result.error || !result.data) throw new Error(result.error);
      const imageSource = result.data.startsWith('data:')
        ? result.data
        : `data:image/png;base64,${result.data}`;
      setQrCodes((current) => ({ ...current, [code]: imageSource }));
    } catch (reason) {
      setLoadError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível gerar o QR Code.',
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

  const isLoading = userLoading || loadingUrls;

  return (
    <div className="min-h-dvh bg-[#f2f1f8] text-[#16151f]">
      <header className="sticky top-0 z-30 border-b border-[#e7e5f0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-15.75 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" aria-label="Ir para o dashboard">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/dashboard"
                className="rounded-full bg-[#eeecfd] px-4 py-2 text-sm font-semibold text-[#5b4fe9]"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="rounded-full px-4 py-2 text-sm font-medium text-[#6b6a78] transition hover:bg-[#f5f4fa] hover:text-[#16151f]"
              >
                Perfil
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 md:gap-5">
            <form action={logoutAction} className="hidden md:block">
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-medium text-[#6b6a78] transition hover:text-[#16151f]"
              >
                <LogOut className="size-4" />
                Sair
              </button>
            </form>
            <Link
              href="/profile"
              aria-label="Abrir perfil"
              className="grid size-8 place-items-center rounded-full bg-linear-to-br from-[#6d63ef] to-[#4338ca] text-[11px] font-bold text-white shadow-sm md:size-9 md:text-xs"
            >
              {getInitials(user?.name)}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-257 px-4 py-6 md:px-6 md:py-10 lg:px-8">
        <section className="mb-5 md:mb-7">
          <p className="mb-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-[#5b4fe9] uppercase md:text-[11px]">
            Seu espaço de links
          </p>
          <h1 className="text-2xl font-extrabold tracking-[-0.04em] md:text-[32px]">
            Encurte um link
          </h1>
          <p className="mt-1 text-[13.5px] leading-5 text-[#6b6a78] md:text-[15px]">
            Cole uma URL longa para criar um link curto e rastreável.
          </p>
        </section>

        <FormMessage>{createState.error ?? loadError}</FormMessage>
        <FormMessage success>{createState.message}</FormMessage>

        <form
          ref={formRef}
          action={createAction}
          className="mb-6 flex flex-col gap-2.5 md:mb-7 md:flex-row md:gap-3"
        >
          <div className="flex h-12 flex-1 items-center gap-2.5 rounded-xl border border-[#e7e5f0] bg-white px-3.5 shadow-[0_1px_2px_rgba(20,18,45,0.03)] transition focus-within:border-[#5b4fe9] focus-within:ring-4 focus-within:ring-[#eeecfd] md:h-13 md:rounded-[10px] md:px-4">
            <Link2 className="size-4.5 shrink-0 text-[#9998a3]" />
            <Input
              name="url"
              type="url"
              required
              aria-label="URL para encurtar"
              placeholder="https://exemplo.com/pagina/muito/longa"
              className="h-full border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 md:text-[15px]"
            />
          </div>
          <Button
            type="submit"
            disabled={isCreating}
            className="h-12 rounded-xl bg-linear-to-r from-[#5b4fe9] to-[#4438d8] px-6 text-[14.5px] font-semibold text-white shadow-[0_12px_22px_-12px_rgba(91,79,233,0.7)] hover:from-[#685df0] hover:to-[#5145df] md:h-13 md:rounded-[10px] md:text-[15px]"
          >
            {isCreating ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Scissors className="size-4" />
            )}
            {isCreating ? 'Encurtando...' : 'Encurtar'}
          </Button>
        </form>

        <section className="mb-6 grid grid-cols-2 gap-2.5 md:mb-7 md:grid-cols-3 md:gap-4">
          <StatCard icon={<Link2 />} label="Links ativos" value={urls.length} />
          <StatCard
            icon={<Activity />}
            label="Cliques totais"
            value={stats.totalClicks.toLocaleString('pt-BR')}
          />
          <StatCard
            wide
            icon={<Trophy />}
            label="Link com mais cliques"
            value={stats.topLink ? `/${stats.topLink['short-code']}` : '—'}
            detail={
              stats.topLink
                ? `${stats.topLink.clicks.toLocaleString('pt-BR')} cliques`
                : 'Sem dados ainda'
            }
            mono
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e7e5f0] bg-white shadow-[0_1px_3px_rgba(20,18,45,0.04)]">
          <header className="flex flex-col gap-3 px-4 pt-4 pb-3 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
            <h2 className="text-[15.5px] font-bold md:text-[17px]">
              Meus links <span className="text-[#9998a3]">({urls.length})</span>
            </h2>
            <div className="flex flex-col gap-2 md:flex-row md:gap-2.5">
              <label className="flex h-10 items-center gap-2 rounded-[10px] border border-[#e7e5f0] px-3 md:h-9.5 md:w-55 md:rounded-lg">
                <Search className="size-4 shrink-0 text-[#9998a3]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar"
                  aria-label="Buscar links"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9998a3]"
                />
              </label>
              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value as SortMode)
                }
                aria-label="Ordenar links"
                className="h-10 rounded-[10px] border border-[#e7e5f0] bg-white px-3 text-sm outline-none focus:border-[#5b4fe9] md:h-9.5 md:rounded-lg"
              >
                <option value="recent">Mais recentes</option>
                <option value="clicks">Mais clicados</option>
                <option value="oldest">Mais antigos</option>
                <option value="az">A–Z</option>
              </select>
            </div>
          </header>

          <div className="border-t border-[#e7e5f0]">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-14 text-sm text-[#6b6a78]">
                <LoaderCircle className="size-4 animate-spin text-[#5b4fe9]" />
                Carregando seus links...
              </div>
            ) : filteredUrls.length ? (
              filteredUrls.map((item) => (
                <article
                  key={item['short-code']}
                  className="border-b border-[#e7e5f0] px-4 py-4 last:border-b-0 md:px-6 md:py-4.5"
                >
                  <div className="flex items-start justify-between gap-3 md:items-center md:gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 flex items-center gap-2 truncate text-[13.5px] font-semibold md:text-[14.5px]">
                        <span aria-hidden="true">🔗</span>
                        <span className="truncate">
                          {item.title || 'Link sem título'}
                        </span>
                      </h3>
                      <div className="mb-1 flex items-center gap-1.5">
                        <Link
                          href={getShortUrlPath(item['short-code'])}
                          target="_blank"
                          className="truncate font-mono text-[13px] font-semibold text-[#5b4fe9] hover:underline md:text-sm"
                        >
                          {getShortUrl(item['short-code']).replace(
                            /^https?:\/\//,
                            '',
                          )}
                        </Link>
                        <button
                          type="button"
                          onClick={() => copyUrl(item['short-code'])}
                          aria-label="Copiar link curto"
                          className="grid size-5 shrink-0 place-items-center rounded-md text-[#9998a3] transition hover:bg-[#eeecfd] hover:text-[#5b4fe9]"
                        >
                          {copiedCode === item['short-code'] ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Clipboard className="size-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="flex min-w-0 items-center gap-1.5 text-xs text-[#6b6a78] md:text-[13px]">
                        <ExternalLink className="size-3 shrink-0 text-[#9998a3]" />
                        <span className="truncate" title={item['original-url']}>
                          {item['original-url']}
                        </span>
                      </p>
                      <p className="mt-1 text-[11.5px] text-[#9998a3] md:text-xs">
                        Criado recentemente
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2 md:flex-row md:items-center md:gap-4">
                      <div className="text-right">
                        <strong className="block text-[17px] leading-none font-extrabold md:text-xl">
                          {item.clicks.toLocaleString('pt-BR')}
                        </strong>
                        <span className="text-[10.5px] text-[#6b6a78] md:text-[11.5px]">
                          cliques
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={generatingQrCode === item['short-code']}
                        onClick={() => generateQrCode(item['short-code'])}
                        aria-label={`Gerar QR Code para ${item.title || 'link'}`}
                        title="Gerar QR Code"
                        className="grid size-8 place-items-center rounded-lg border border-[#e7e5f0] text-[#5b4fe9] transition hover:border-[#d8d3fa] hover:bg-[#eeecfd] disabled:cursor-wait disabled:opacity-60"
                      >
                        {generatingQrCode === item['short-code'] ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                          <QrCode className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  {qrCodes[item['short-code']] && (
                    <div className="mt-4 flex flex-col items-center gap-4 rounded-xl border border-[#ddd9fb] bg-[#f7f6ff] p-4 sm:flex-row">
                      <div className="shrink-0 rounded-xl bg-white p-2 shadow-sm">
                        <Image
                          src={qrCodes[item['short-code']]}
                          alt={`QR Code para ${getShortUrl(item['short-code'])}`}
                          width={112}
                          height={112}
                          unoptimized
                          className="size-28"
                        />
                      </div>
                      <div className="min-w-0 text-center sm:text-left">
                        <p className="text-sm font-bold">QR Code pronto</p>
                        <p className="mt-1 mb-3 text-xs leading-5 text-[#6b6a78]">
                          Escaneie para abrir o link ou baixe a imagem para
                          compartilhar.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => downloadQrCode(item['short-code'])}
                          className="border-[#d8d3fa] bg-white text-[#5b4fe9] hover:bg-[#eeecfd] hover:text-[#4b3fd8]"
                        >
                          <Download className="size-3.5" />
                          Baixar PNG
                        </Button>
                      </div>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-[#eeecfd] text-[#5b4fe9]">
                  <Link2 className="size-4.5" />
                </div>
                <p className="text-sm font-semibold">
                  {query
                    ? 'Nenhum link corresponde à busca'
                    : 'Nenhum link encontrado'}
                </p>
                <p className="mt-1 text-xs text-[#6b6a78]">
                  {query
                    ? 'Tente buscar por outro termo.'
                    : 'Encurte sua primeira URL acima.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  wide,
  mono,
}: {
  icon: ReactElement<{ className?: string }>;
  label: string;
  value: string | number;
  detail?: string;
  wide?: boolean;
  mono?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border border-[#e7e5f0] bg-white p-3.5 shadow-[0_1px_3px_rgba(20,18,45,0.04)] md:p-5 ${wide ? 'col-span-2 md:col-span-1' : ''}`}
    >
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#6b6a78] md:mb-3 md:gap-2 md:text-[13px]">
        <span className="text-[#5b4fe9] [&>svg]:size-3.5">{icon}</span>
        {label}
      </p>
      <strong
        className={`block font-extrabold tracking-[-0.03em] ${mono ? 'font-mono text-[17px] md:text-xl' : 'text-xl md:text-[26px]'}`}
      >
        {value}
      </strong>
      {detail && (
        <p className="mt-0.5 text-[11.5px] text-[#6b6a78] md:text-xs">
          {detail}
        </p>
      )}
    </article>
  );
}
