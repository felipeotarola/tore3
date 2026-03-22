import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const Cta = () => {
  return (
    <section className="section-padding container">
      <div className="flex flex-col items-center gap-8 text-center">
        <h2 className="mx-auto w-full max-w-2xl text-center text-4xl">
          Let&apos;s create something extraordinary.
        </h2>

        <Button variant="outline" size="lg" asChild>
          <Link href="/contact">Work with TOREKULL</Link>
        </Button>
      </div>
    </section>
  );
};
