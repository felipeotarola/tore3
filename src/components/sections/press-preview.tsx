import Link from 'next/link';

import { PressTile } from '@/components/press/press-tile';
import { Button } from '@/components/ui/button';
import { PRESS_ITEMS } from '@/lib/torekull';

export const PressPreview = () => {
  return (
    <section className="section-padding-tight container space-y-10">
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
          <PressTile
            key={item.title}
            title={item.title}
            image={item.image}
            href={item.url}
            headingLevel="h3"
          />
        ))}
      </div>
    </section>
  );
};
