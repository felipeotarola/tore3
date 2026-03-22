import Link from 'next/link';

import { PressTile } from '@/components/press/press-tile';
import { Button } from '@/components/ui/button';
import { getPressItems } from '@/lib/press-items';

export const PressPreview = async () => {
  const pressItems = await getPressItems();

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
        {pressItems.slice(0, 6).map((item) => (
          <PressTile
            key={item.slug}
            slug={item.slug}
            title={item.title}
            image={item.image}
            headingLevel="h3"
          />
        ))}
      </div>
    </section>
  );
};
