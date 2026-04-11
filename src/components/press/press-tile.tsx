import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  formatPressDisplayTitle,
  splitPressTitleForLines,
} from '@/lib/press';
import { cn } from '@/lib/utils';

type PressTileProps = {
  slug: string;
  title: string;
  image: string;
  headingLevel?: 'h2' | 'h3';
  /** Optional external publication URL for override behavior. */
  href?: string;
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
}: PressTileProps) {
  const label = formatPressDisplayTitle(title);
  const [line1, line2] = splitPressTitleForLines(label);
  const Heading = headingLevel;

  const destination = href ?? `/press/${slug}`;
  const external = isExternalHref(destination);

  const ariaLabel = external
    ? `${label}, articles and magazines - opens in a new tab`
    : `${label} - articles and magazines`;

  return (
    <Link
      href={destination}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'group border-border block overflow-hidden rounded-md border',
        'outline-none transition-shadow hover:shadow-md',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
      aria-label={ariaLabel}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/65"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6 text-center sm:px-6">
          <Heading className="max-w-[20ch] text-balance text-lg font-semibold leading-snug tracking-tight text-white drop-shadow-md sm:max-w-[24ch] sm:text-xl md:max-w-[26ch] md:text-2xl md:leading-tight">
            {line1}
            {line2 != null && (
              <>
                <br />
                {line2}
              </>
            )}
          </Heading>
          <span
            className="mt-4 inline-flex items-center justify-center rounded-full border border-white/12 bg-black/20 p-1.5 text-white/55 shadow-none backdrop-blur-[2px] transition duration-300 group-hover:border-white/22 group-hover:bg-black/30 group-hover:text-white/95"
            aria-hidden
          >
            <ExternalLink className="size-3.5 stroke-[1.25]" />
          </span>
        </div>
      </div>
    </Link>
  );
}
