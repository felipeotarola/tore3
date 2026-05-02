import { Metadata } from 'next';

import { EditableText } from '@/components/editing/editable-text';
import { LandingCopyEditorProvider } from '@/components/editing/landing-copy-editor-provider';
import { DetailPageHeader } from '@/components/navigation/detail-page-header';
import { PressTile } from '@/components/press/press-tile';
import { getPressItems, prioritizeFeaturedPressItem } from '@/lib/press-items';

export const metadata: Metadata = {
  title: 'Articles & Magazines',
};

export default async function PressPage() {
  const pressItems = prioritizeFeaturedPressItem(await getPressItems());

  return (
    <LandingCopyEditorProvider>
      <DetailPageHeader
        fallbackHref="/"
        eyebrow={
          <EditableText
            as="span"
            copyKey="press.page.kicker"
            fallback="In the press"
          />
        }
        title={
          <EditableText
            as="span"
            copyKey="press.page.title"
            fallback="Articles & Magazines"
          />
        }
        description={
          <EditableText
            as="span"
            copyKey="press.page.description"
            fallback="How they write about us"
            singleLine={false}
          />
        }
      />

      <section className="container pb-12 md:pb-16 lg:pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pressItems.map((item, index) => (
            <PressTile
              key={item.slug}
              slug={item.slug}
              title={item.title}
              image={item.image}
              headingLevel="h2"
              priority={index < 6}
            />
          ))}
        </div>
      </section>
    </LandingCopyEditorProvider>
  );
}
