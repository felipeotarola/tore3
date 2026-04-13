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
        padding === 'tight' ? 'section-padding-tight' : 'section-padding',
      )}
    >
      <div className="flex flex-col items-center gap-8 text-center">
        <h2 className="mx-auto w-full max-w-2xl text-center text-4xl">
          Let&apos;s create something extraordinary.
        </h2>

      </div>
    </section>
  );
};
