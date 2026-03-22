import { Metadata } from 'next';

import { PressTile } from '@/components/press/press-tile';
import { PRESS_ITEMS } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'Articles & Magazines',
};

export default function PressPage() {
  return (
    <section className="hero-padding container space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl">Articles &amp; Magazines</h1>
        <p className="text-muted-foreground text-lg">How they write about us</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRESS_ITEMS.map((item) => (
          <PressTile
            key={item.title}
            title={item.title}
            image={item.image}
            href={item.url}
            headingLevel="h2"
          />
        ))}
      </div>
    </section>
  );
}
