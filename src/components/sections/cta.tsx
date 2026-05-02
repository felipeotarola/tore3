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
      <div className="border-y border-border/70 py-7 text-center md:py-8">
        <h2 className="tk-section-title mx-auto max-w-2xl">
          Let&apos;s create something extraordinary.
        </h2>
      </div>
    </section>
  );
};
