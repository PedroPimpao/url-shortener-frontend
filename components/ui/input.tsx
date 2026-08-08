import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full min-w-0 rounded-lg border border-[#d8dae5] bg-white px-3.5 py-2 text-sm transition-shadow outline-none placeholder:text-[#a3a7b5] focus-visible:border-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-500/15 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
