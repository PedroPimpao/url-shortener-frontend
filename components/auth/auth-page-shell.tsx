import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

type AuthPageShellProps = {
  backHref: string;
  mobileTag: string;
  mobileEyebrow: string;
  mobileTitle: string;
  mobileDescription?: string;
  desktopEyebrow: string;
  desktopTitle: string;
  desktopDescription: string;
  desktopItems?: string[];
  children: ReactNode;
};

export const AuthPageShell = ({
  backHref,
  mobileTag,
  mobileEyebrow,
  mobileTitle,
  mobileDescription,
  desktopEyebrow,
  desktopTitle,
  desktopDescription,
  desktopItems,
  children,
}: AuthPageShellProps) => (
  <main className="min-h-dvh bg-[#0a0e27] p-0 text-[#0b1130] md:grid md:place-items-center md:bg-[#eef1f8] md:p-8">
    <Card className="mx-auto flex min-h-dvh w-full max-w-295 flex-col overflow-hidden rounded-none border-0 bg-white md:grid md:min-h-175 md:grid-cols-2 md:rounded-[28px] md:shadow-[0_60px_100px_-40px_rgba(19,33,104,0.35)]">
      <aside className="relative flex min-h-72.5 flex-col overflow-hidden bg-[radial-gradient(90%_70%_at_10%_90%,#7c9cff_0%,transparent_55%),radial-gradient(90%_70%_at_90%_10%,#6d8cff_0%,transparent_55%),linear-gradient(150deg,#060b2e_0%,#132168_50%,#3d5afe_130%)] px-6 pt-6 pb-12 text-white md:min-h-0 md:p-12">
        <div className="absolute -top-24 -right-32 size-105 animate-pulse rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.14),transparent_70%)] blur-xl" />
        <div className="relative z-10 flex items-center justify-between md:justify-start md:gap-2.5">
          <Link
            href={backHref}
            aria-label="Voltar"
            className="grid size-9.5 place-items-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm md:hidden"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="hidden items-center gap-2.5 md:flex">
            <span className="size-8 rounded-[9px] bg-linear-to-br from-white to-[#7c9cff]" />
            <span className="text-lg font-bold">Fluxo</span>
          </div>
          <span className="font-mono text-[11px] tracking-[0.14em] text-white/65 uppercase md:hidden">
            Fluxo · {mobileTag}
          </span>
          <span className="size-9.5 md:hidden" />
        </div>

        <div className="relative z-10 mt-auto">
          <p className="mb-2 flex items-center gap-2 font-mono text-[11.5px] tracking-[0.08em] text-[#9bb1ff] before:h-px before:w-3.5 before:bg-[#9bb1ff] md:mb-3.5 md:text-xs md:uppercase">
            <span className="md:hidden">{mobileEyebrow}</span>
            <span className="hidden md:inline">{desktopEyebrow}</span>
          </p>
          <h1 className="max-w-115 text-[34px] leading-[1.08] font-bold tracking-[-0.02em] md:text-[46px] md:leading-[1.1]">
            <span className="md:hidden">{mobileTitle}</span>
            <span className="hidden md:inline">{desktopTitle}</span>
          </h1>
          {mobileDescription && (
            <p className="mt-3 max-w-100 text-[13.5px] leading-6 text-white/70 md:hidden">
              {mobileDescription}
            </p>
          )}
          <p className="mt-4 hidden max-w-100 text-[15px] leading-6 text-white/70 md:block">
            {desktopDescription}
          </p>
        </div>

        {desktopItems && (
          <div className="relative z-10 mt-12 hidden space-y-3 text-sm text-white/85 md:block">
            {desktopItems.map((item) => (
              <p key={item} className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-full bg-white/15">
                  <Check className="size-3.5" />
                </span>
                {item}
              </p>
            ))}
          </div>
        )}

        <svg
          viewBox="0 0 390 60"
          preserveAspectRatio="none"
          className="absolute right-0 -bottom-px left-0 h-13 w-full md:hidden"
          aria-hidden="true"
        >
          <path
            d="M0,32 C65,60 130,4 195,20 C260,36 325,58 390,26 L390,60 L0,60 Z"
            fill="#fff"
          />
        </svg>
      </aside>
      {children}
    </Card>
  </main>
);

type AuthFormPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  showProgress?: boolean;
  children: ReactNode;
};

export const AuthFormPanel = ({
  eyebrow,
  title,
  description,
  showProgress,
  children,
}: AuthFormPanelProps) => (
  <div className="relative z-10 -mt-px flex flex-1 flex-col rounded-t-[30px] bg-white px-6 pt-5 pb-7 md:mt-0 md:justify-center md:rounded-none md:px-18 md:py-12">
    <div className="mx-auto mb-4 h-1 w-10 rounded bg-[#e7eaf3] md:hidden" />
    {showProgress && (
      <div className="mb-5 flex gap-1.5 md:hidden">
        {[1, 2, 3].map((step) => (
          <span key={step} className="h-1 flex-1 rounded bg-[#3d5afe]" />
        ))}
      </div>
    )}
    <header className="hidden md:block">
      <p className="mb-2.5 font-mono text-[11.5px] tracking-[0.08em] text-[#8992a9] uppercase">
        {eyebrow}
      </p>
      <h2 className="mb-2 text-[32px] font-bold tracking-[-0.01em]">{title}</h2>
      <p className="mb-7 text-[14.5px] text-[#8992a9]">{description}</p>
    </header>
    {children}
  </div>
);
