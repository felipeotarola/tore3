import { Metadata } from 'next';

import { PressTile } from '@/components/press/press-tile';
import { getPressItems } from '@/lib/press-items';

export const metadata: Metadata = {
  title: 'Articles & Magazines',
};

export default async function PressPage() {
  const pressItems = await getPressItems();

  return (
    <section className="hero-padding container space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl">Articles &amp; Magazines</h1>
        <p className="text-muted-foreground text-lg">How they write about us</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pressItems.map((item) => (
          <PressTile
            key={item.slug}
            slug={item.slug}
            title={item.title}
            image={item.image}
            headingLevel="h2"
          />
        ))}
      </div>
    </section>
  );
}
