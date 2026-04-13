import { EditableText } from '@/components/editing/editable-text';
import { DetailCloseButton } from '@/components/navigation/detail-close-button';

/** Hero — two-column scan on large screens (shadcnblocks-style split headline). */
export function AboutFounderHero() {
  return (
    <section className="container flex flex-col gap-6 pt-20 pb-10 md:gap-8 md:pt-24 md:pb-12 lg:pt-28 lg:pb-14">
      <DetailCloseButton fallbackHref="/" />

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10 lg:items-start">
        <div className="space-y-3 lg:col-span-6 xl:col-span-5">
          <EditableText
            as="p"
            copyKey="about.hero.kicker"
            fallback="The practice"
            className="nav-caps text-xs text-muted-foreground"
          />
          <EditableText
            as="h1"
            copyKey="about.hero.title"
            fallback="About TOREKULL"
            className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl"
          />
        </div>
        <div className="lg:col-span-6 xl:col-span-7">
          <hr className="border-border mb-4 border-t lg:hidden" />
          <EditableText
            as="p"
            copyKey="about.hero.description"
            fallback="The studio is led by founder Maja-Li Torekull - an interior architect and designer working across commercial interiors, custom furniture, and product development for clients in Europe and the United States."
            className="text-muted-foreground max-w-2xl text-base leading-snug md:text-base md:leading-relaxed"
            singleLine={false}
          />
        </div>
      </div>
    </section>
  );
}
