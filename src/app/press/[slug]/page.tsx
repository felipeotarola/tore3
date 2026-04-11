import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { Cta } from '@/components/sections/cta';
import { Button } from '@/components/ui/button';
import {
  formatPressDisplayTitle,
  getPressTitleParts,
  splitPressTitleForLines,
} from '@/lib/press';
import { getPressItems } from '@/lib/press-items';

interface PressDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const pressItems = await getPressItems();
  return pressItems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: PressDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pressItems = await getPressItems();
  const item = pressItems.find((entry) => entry.slug === slug);

  if (!item) return {};

  const label = formatPressDisplayTitle(item.title);

  return {
    title: label,
    description: `Press feature: ${label}`,
    openGraph: {
      title: `${label} - TOREKULL`,
      description: `Press feature: ${label}`,
      images: [{ url: item.image, alt: label }],
    },
  };
}

export default async function PressDetailPage({ params }: PressDetailPageProps) {
  const { slug } = await params;
  const pressItems = await getPressItems();
  const index = pressItems.findIndex((entry) => entry.slug === slug);

  if (index < 0) {
    return notFound();
  }

  const item = pressItems[index];
  const nextItem = pressItems[(index + 1) % pressItems.length];
  const titleParts = getPressTitleParts(item.title);
  const label = titleParts.fullTitle;
  const [line1, line2] = splitPressTitleForLines(label);
  const publication = titleParts.publication;
  const year = titleParts.year ?? 'Not specified';
  const reference = titleParts.secondary ?? 'Feature';
  const pressSummary = `Feature from ${publication}${
    year !== 'Not specified' ? ` (${year})` : ''
  }.`;

  return (
    <>
      <section className="space-y-5 pt-6 pb-7 md:space-y-6 md:pt-8 md:pb-9">
        <div className="container">
          <DetailCloseButton fallbackHref="/press" />
        </div>

        <div className="container space-y-2 text-center md:space-y-2.5">
          <p className="nav-caps text-muted-foreground text-xs">
            Articles &amp; Magazines
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl">
            {line1}
            {line2 && (
              <>
                <br />
                {line2}
              </>
            )}
          </h1>
        </div>

        <div className="bigger-container">
          <div className="border-border bg-card relative mx-auto aspect-[4/3] w-full max-w-[1400px] overflow-hidden rounded-sm border md:aspect-[3/2]">
            <Image
              src={item.image}
              alt={label}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1536px) 90vw, 1400px"
              priority
            />
          </div>
        </div>

        <div className="container max-w-4xl border-t border-border/70 pt-4 pb-6 md:pt-5 md:pb-7">
          <p className="nav-caps text-muted-foreground mb-1 text-[0.65rem] tracking-[0.14em]">
            Press overview
          </p>
          <p className="text-muted-foreground mb-3 text-sm leading-snug">
            {pressSummary}
          </p>
          <dl className="grid gap-x-5 gap-y-2 sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground mb-0.5 text-[0.65rem] tracking-widest uppercase">
                Publication
              </dt>
              <dd className="text-foreground text-sm leading-snug">{publication}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground mb-0.5 text-[0.65rem] tracking-widest uppercase">
                Year
              </dt>
              <dd className="text-foreground text-sm leading-snug">{year}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground mb-0.5 text-[0.65rem] tracking-widest uppercase">
                Reference
              </dt>
              <dd className="text-foreground text-sm leading-snug">{reference}</dd>
            </div>
          </dl>
          {item.url ? (
            <div className="mt-4">
              <Button variant="outline" size="sm" asChild>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Open publication
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-padding container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="nav-caps text-muted-foreground text-xs">Next press</p>
          <h2 className="text-3xl">
            {formatPressDisplayTitle(nextItem.title)}
          </h2>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/press/${nextItem.slug}`}>View next press</Link>
        </Button>
      </section>

      <Cta />
    </>
  );
}
