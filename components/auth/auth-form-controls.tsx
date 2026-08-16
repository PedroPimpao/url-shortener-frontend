'use client';

import type { ComponentType, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { cn } from '@/lib/utils';

type AuthFieldProps = {
  id: string;
  label: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
};

export const AuthField = ({
  id,
  label,
  icon: Icon,
  aside,
  className,
  children,
}: AuthFieldProps) => (
  <Field className={cn('gap-0', className)}>
    <div className="flex items-center justify-between">
      <FieldLabel
        htmlFor={id}
        className="mb-2 font-mono text-[11.5px] font-semibold tracking-[0.08em] text-[#8992a9] uppercase md:font-sans md:text-[13px] md:tracking-normal md:text-[#0b1130] md:normal-case"
      >
        {label}
      </FieldLabel>
      {aside}
    </div>
    <div className="flex items-center gap-2.5 rounded-2xl border-[1.5px] border-[#e7eaf3] bg-[#f6f8fc] px-3.5 transition focus-within:border-[#3d5afe] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#3d5afe]/10 md:rounded-[14px]">
      {Icon && <Icon className="size-4.5 shrink-0 text-[#8992a9]" />}
      {children}
    </div>
  </Field>
);

export const authInputClassName =
  'border-0 bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0';

export const AuthSubmitButton = ({
  idleLabel,
  loadingLabel,
}: {
  idleLabel: string;
  loadingLabel: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-live="polite"
      className="h-12.5 w-full rounded-[14px] bg-linear-to-r from-[#3d5afe] to-[#2541db] text-[14.5px] font-bold text-white shadow-[0_16px_26px_-12px_rgba(61,90,254,0.55)] hover:from-[#526bff] hover:to-[#3650de]"
    >
      {pending && (
        <LoaderCircle className="size-4.5 animate-spin" aria-hidden="true" />
      )}
      {pending ? loadingLabel : idleLabel}
    </Button>
  );
};

export const MobileAuthLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => (
  <Button
    variant="outline"
    nativeButton={false}
    className="mt-2.5 h-11.5 w-full rounded-[14px] border-[1.5px] border-[#e7eaf3] text-[13.5px] font-semibold md:hidden"
    render={<Link href={href} />}
  >
    {children}
  </Button>
);

export const AuthSwitchLink = ({
  text,
  href,
  label,
}: {
  text: string;
  href: string;
  label: string;
}) => (
  <p className="mt-5 text-center text-[13.5px] text-[#8992a9] max-md:hidden">
    {text}{' '}
    <Link href={href} className="font-bold text-[#3d5afe] hover:underline">
      {label}
    </Link>
  </p>
);

export const AuthDivider = ({ children }: { children: ReactNode }) => (
  <FieldSeparator className="my-5 font-mono text-xs text-[#8992a9] md:mt-7 md:mb-5">
    {children}
  </FieldSeparator>
);
