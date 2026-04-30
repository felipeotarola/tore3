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
          ? 'py-8 md:py-10 lg:py-12'
          : 'py-10 md:py-12 lg:py-14',
      )}
    >
      <div className="border-y border-border/70 py-7 text-center md:py-8">
        <h2 className="mx-auto max-w-2xl text-3xl leading-tight tracking-[-0.025em] md:text-4xl">
          Let&apos;s create something extraordinary.
        </h2>
      </div>
    </section>
  );
};
