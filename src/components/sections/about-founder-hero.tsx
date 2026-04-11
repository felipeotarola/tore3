import { DetailCloseButton } from '@/components/navigation/detail-close-button';

export function AboutFounderHero() {
  return (
    <section className="hero-padding container flex flex-col gap-10 lg:gap-12">
      <DetailCloseButton fallbackHref="/" />

      <div className="max-w-3xl space-y-3">
        <p className="nav-caps text-xs text-muted-foreground">The practice</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl">About TOREKULL</h1>
        <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
          The studio is led by founder{' '}
          <span className="text-foreground">Maja-Li Torekull</span>—an interior
          architect and designer working across commercial interiors, custom
          furniture, and product development for clients in Europe and the
          United States.
        </p>
      </div>
    </section>
  );
}
