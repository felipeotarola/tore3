import { Metadata } from 'next';
import Image from 'next/image';

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
          <article
            key={item.title}
            className="bg-card border-border overflow-hidden border"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h2 className="text-sm">{item.title}</h2>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

