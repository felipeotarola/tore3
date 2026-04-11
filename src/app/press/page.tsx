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
      <div className="hero-padding container flex flex-col gap-10 lg:gap-12">
        <DetailCloseButton fallbackHref="/" />

        <header className="max-w-3xl space-y-3">
          <EditableText
            as="p"
            copyKey="press.page.kicker"
            fallback="In the press"
            className="nav-caps text-xs text-muted-foreground"
          />
          <EditableText
            as="h1"
            copyKey="press.page.title"
            fallback="Articles & Magazines"
            className="text-4xl md:text-5xl lg:text-6xl"
          />
          <EditableText
            as="p"
            copyKey="press.page.description"
            fallback="How they write about us"
            className="text-muted-foreground text-base leading-relaxed md:text-lg"
            singleLine={false}
          />
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
    </LandingCopyEditorProvider>
  );
}
