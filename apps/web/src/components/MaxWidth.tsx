import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface MaxWidthProps {
  className?: string;
  children: ReactNode;
}

function MaxWidth({ children, className }: MaxWidthProps) {
  return (
    <section
      className={cn(
        'h-full mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-20',
        className
      )}
    >
      {children}
    </section>
  );
}

export default MaxWidth;
