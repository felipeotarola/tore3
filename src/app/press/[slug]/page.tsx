import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  MetadataGrid,
  MetadataItem,
} from '@/components/layout/primitives';
import { DetailPageHeader } from '@/components/navigation/detail-page-header';
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

  if (index < 0) return notFound();

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
      <DetailPageHeader
        fallbackHref="/press"
        centered
        eyebrow="Articles & Magazines"
        title={line2 ? `${line1} ${line2}` : line1}
        description={pressSummary}
        titleClassName="max-w-4xl"
      />

      <section className="container tk-section-tight">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.64fr)_minmax(320px,0.36fr)] lg:items-start lg:gap-8 xl:gap-10">
          <div className="tk-image-frame bg-card/20">
            <div className="relative aspect-[4/3] w-full md:aspect-[3/2]">
              <Image
                src={item.image}
                alt={label}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 62vw"
                priority
              />
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <MetadataGrid className="grid-cols-1">
              <MetadataItem label="Publication">{publication}</MetadataItem>
              <MetadataItem label="Year">{year}</MetadataItem>
              <MetadataItem label="Reference">{reference}</MetadataItem>
            </MetadataGrid>

            {item.url && (
              <Button variant="outline" size="sm" asChild>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Open publication
                </a>
              </Button>
            )}
          </aside>
        </div>
      </section>

      <section className="container tk-section-tight">
        <div className="flex flex-col gap-5 border-y border-border/70 py-6 md:flex-row md:items-center md:justify-between md:py-7">
          <div className="space-y-1">
            <p className="tk-meta-label">
              Next press
            </p>

            <h2 className="tk-section-title max-w-3xl">
              {formatPressDisplayTitle(nextItem.title)}
            </h2>
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link href={`/press/${nextItem.slug}`}>View next press</Link>
          </Button>
        </div>
      </section>

      <div className="pb-10 md:pb-12 lg:pb-14">
        <Cta padding="tight" />
      </div>
    </>
  );
}
