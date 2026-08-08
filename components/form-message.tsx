import { cn } from '@/lib/utils';

export function FormMessage({
  children,
  success = false,
}: {
  children?: string;
  success?: boolean;
}) {
  if (!children) return null;
  return (
    <p
      role="status"
      className={cn(
        'mb-4 rounded-lg px-3 py-2 text-left text-xs font-medium',
        success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
      )}
    >
      {children}
    </p>
  );
}
