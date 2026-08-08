import * as React from 'react';
import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn('rounded-xl border border-[#e5e7ef] bg-white', className)}
      {...props}
    />
  );
}

export { Card };
