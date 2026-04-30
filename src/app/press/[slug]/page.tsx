import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
        title={
          <>
            {line1}
            {line2 && (
              <>
                <br />
                {line2}
              </>
            )}
          </>
        }
        titleClassName="leading-[0.95] tracking-[-0.04em]"
      />

      {/* IMAGE */}
      <section className="container pb-10 md:pb-12 lg:pb-14">
        <div className="mx-auto max-w-[1200px] overflow-hidden border border-border/70">
          <div className="relative aspect-[4/3] w-full md:aspect-[3/2]">
            <Image
              src={item.image}
              alt={label}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              priority
            />
          </div>
        </div>
      </section>

      {/* META / DETAILS */}
      <section className="container pb-10 md:pb-12 lg:pb-14">
        <div className="mx-auto max-w-3xl border-t border-border/70 pt-5">
          <p className="nav-caps text-[11px] tracking-[0.2em] text-muted-foreground">
            Press overview
          </p>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {pressSummary}
          </p>

          <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-3">
            <div>
              <dt className="nav-caps text-[10px] tracking-[0.18em] text-muted-foreground">
                Publication
              </dt>
              <dd className="mt-1 text-sm">{publication}</dd>
            </div>

            <div>
              <dt className="nav-caps text-[10px] tracking-[0.18em] text-muted-foreground">
                Year
              </dt>
              <dd className="mt-1 text-sm">{year}</dd>
            </div>

            <div>
              <dt className="nav-caps text-[10px] tracking-[0.18em] text-muted-foreground">
                Reference
              </dt>
              <dd className="mt-1 text-sm">{reference}</dd>
            </div>
          </dl>

          {item.url && (
            <div className="mt-6">
              <Button variant="outline" size="sm" asChild>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Open publication
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* NEXT */}
      <section className="container pb-10 md:pb-12 lg:pb-14">
        <div className="flex flex-col gap-5 border-y border-border py-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="nav-caps text-[11px] tracking-[0.2em] text-muted-foreground">
              Next press
            </p>

            <h2 className="text-2xl leading-tight tracking-[-0.02em] md:text-3xl">
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
