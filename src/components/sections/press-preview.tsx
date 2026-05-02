import Link from 'next/link';

import { EditableText } from '@/components/editing/editable-text';
import { PressTile } from '@/components/press/press-tile';
import { Button } from '@/components/ui/button';
import { getPressItems, prioritizeFeaturedPressItem } from '@/lib/press-items';

export const PressPreview = async () => {
  const pressItems = prioritizeFeaturedPressItem(await getPressItems());

  return (
    <section className="container tk-section space-y-8 md:space-y-10">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <EditableText
            as="h2"
            copyKey="home.press.heading"
            fallback="Articles & Magazines"
            className="tk-section-title"
          />
          <EditableText
            as="p"
            copyKey="home.press.description"
            fallback="How they write about us"
            className="tk-lead"
          />
        </div>
        <Button variant="outline" asChild>
          <Link href="/press">
            <EditableText
              as="span"
              copyKey="home.press.cta"
              fallback="See all press"
            />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {pressItems.slice(0, 3).map((item, index) => (
          <PressTile
            key={item.slug}
            slug={item.slug}
            title={item.title}
            image={item.image}
            headingLevel="h3"
            priority={index < 3}
          />
        ))}
      </div>
    </section>
  );
};
