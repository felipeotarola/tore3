import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { formatPressDisplayTitle } from '@/lib/press';
import { cn } from '@/lib/utils';

type PressTileProps = {
  slug: string;
  title: string;
  image: string;
  headingLevel?: 'h2' | 'h3';
  /** Optional external publication URL for override behavior. */
  href?: string;
  priority?: boolean;
};

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function PressTile({
  slug,
  title,
  image,
  headingLevel = 'h3',
  href,
  priority = false,
}: PressTileProps) {
  const label = formatPressDisplayTitle(title);
  const Heading = headingLevel;

  const destination = href ?? `/press/${slug}`;
  const external = isExternalHref(destination);

  const ariaLabel = external
    ? `${label}, articles and magazines - opens in a new tab`
    : `${label} - articles and magazines`;

  return (
    <Link
      href={destination}
      data-editor-lock-nav="true"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'group block overflow-hidden rounded-md border border-border/70 bg-card/20',
        'outline-none transition-colors hover:border-foreground/25',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
      aria-label={ariaLabel}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/55">
        <Image
          src={image}
          alt=""
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-black/[0.03] transition-colors group-hover:bg-black/0" aria-hidden />
      </div>
      <div className="flex min-h-28 flex-col gap-4 border-t border-border/50 p-4 md:p-5">
        <Heading className="tk-card-title line-clamp-3">
          {label}
        </Heading>
        <span className="tk-meta-label mt-auto inline-flex items-center gap-1.5 text-foreground/75 transition-colors group-hover:text-foreground">
          Read feature
          <ExternalLink className="size-3.5 stroke-[1.5]" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
