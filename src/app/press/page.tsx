import { Metadata } from 'next';

import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { PressTile } from '@/components/press/press-tile';
import { getPressItems } from '@/lib/press-items';

export const metadata: Metadata = {
  title: 'Articles & Magazines',
};

export default async function PressPage() {
  const pressItems = await getPressItems();

  return (
    <div className="hero-padding container flex flex-col gap-10 lg:gap-12">
      <DetailCloseButton fallbackHref="/" />

      <header className="max-w-3xl space-y-3">
        <p className="nav-caps text-xs text-muted-foreground">In the press</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl">Articles &amp; Magazines</h1>
        <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
          How they write about us
        </p>
      </header>

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
    </div>
  );
}
