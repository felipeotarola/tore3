import { Metadata } from 'next';

import { EditableText } from '@/components/editing/editable-text';
import { LandingCopyEditorProvider } from '@/components/editing/landing-copy-editor-provider';
import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { PressTile } from '@/components/press/press-tile';
import { getPressItems, prioritizeFeaturedPressItem } from '@/lib/press-items';

export const metadata: Metadata = {
  title: 'Articles & Magazines',
};

export default async function PressPage() {
  const pressItems = prioritizeFeaturedPressItem(await getPressItems());

  return (
    <LandingCopyEditorProvider>
      <div className="container pt-10 pb-12 md:pt-14 md:pb-14 lg:pt-16 lg:pb-16">
        <div className="flex flex-col gap-8 md:gap-10">
          <DetailCloseButton fallbackHref="/" />

          <header className="max-w-2xl space-y-2">
            <EditableText
              as="p"
              copyKey="press.page.kicker"
              fallback="In the press"
              className="nav-caps text-[11px] tracking-[0.2em] text-muted-foreground"
            />

            <EditableText
              as="h1"
              copyKey="press.page.title"
              fallback="Articles & Magazines"
              className="text-4xl leading-tight tracking-[-0.035em] md:text-5xl lg:text-6xl"
            />

            <EditableText
              as="p"
              copyKey="press.page.description"
              fallback="How they write about us"
              className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
              singleLine={false}
            />
          </header>

          <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
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
      </div>
    </LandingCopyEditorProvider>
  );
}