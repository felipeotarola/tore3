import { EditableText } from '@/components/editing/editable-text';
import { DetailCloseButton } from '@/components/navigation/detail-close-button';

export function AboutFounderHero() {
  return (
    <section className="hero-padding container flex flex-col gap-10 lg:gap-12">
      <DetailCloseButton fallbackHref="/" />

      <div className="max-w-3xl space-y-3">
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
          className="text-4xl md:text-5xl lg:text-6xl"
        />
        <EditableText
          as="p"
          copyKey="about.hero.description"
          fallback="The studio is led by founder Maja-Li Torekull - an interior architect and designer working across commercial interiors, custom furniture, and product development for clients in Europe and the United States."
          className="text-muted-foreground text-base leading-relaxed md:text-lg"
          singleLine={false}
        />
      </div>
    </section>
  );
}

