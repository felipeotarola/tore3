import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CtaProps = {
  /** Use on long pages (e.g. About) to reduce trailing whitespace. */
  padding?: 'default' | 'tight';
};

export const Cta = ({ padding = 'default' }: CtaProps) => {
  return (
    <section
      className={cn(
        'container',
        padding === 'tight'
          ? 'tk-section-tight'
          : 'tk-section',
      )}
    >
      <div className="flex flex-col items-start gap-5 border-y border-border/70 py-7 md:flex-row md:items-center md:justify-between md:gap-8 md:py-8">
        <h2 className="tk-section-title max-w-2xl">
          Let&apos;s create something extraordinary.
        </h2>
        <Button asChild variant="default" className="shrink-0">
          <Link href="/contact">Start a conversation</Link>
        </Button>
      </div>
    </section>
  );
};
