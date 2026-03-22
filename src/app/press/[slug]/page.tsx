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
      <section className="space-y-12 pt-10 pb-12 md:space-y-14 md:pt-12 md:pb-14">
        <div className="container space-y-4">
          <DetailCloseButton fallbackHref="/press" />
        </div>

        <div className="container space-y-4 text-center">
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
      </section>

      <section className="section-padding container">
        <div className="grid gap-10 md:grid-cols-2">
          <h2 className="text-4xl">Press overview</h2>
          <p className="text-muted-foreground text-lg">{pressSummary}</p>
        </div>

        <div className="mt-10 grid justify-between gap-6 sm:mt-20 sm:grid-cols-3 lg:mt-26 xl:mt-36">
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-lg">Publication</p>
            <p className="text-lg">{publication}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-lg">Year</p>
            <p className="text-lg">{year}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-lg">Reference</p>
            <p className="text-lg">{reference}</p>
          </div>
        </div>

        {item.url && (
          <div className="mt-10">
            <Button variant="outline" asChild>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Open publication
              </a>
            </Button>
          </div>
        )}
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
