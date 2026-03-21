import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PRESS_ITEMS } from '@/lib/torekull';

export const PressPreview = () => {
  return (
    <section className="section-padding container space-y-10">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-3">
          <h2 className="text-4xl">Articles &amp; Magazines</h2>
          <p className="text-muted-foreground">How they write about us</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/press">See all press</Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRESS_ITEMS.slice(0, 6).map((item) => (
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
              <h3 className="text-sm">{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

