import Image from 'next/image';

import { FOUNDER_PORTRAIT } from '@/lib/torekull';

export function ContactPortrait() {
  return (
    <figure className="mx-auto w-full max-w-md lg:mx-0">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-border bg-muted">
        <Image
          src={FOUNDER_PORTRAIT.src}
          alt={FOUNDER_PORTRAIT.alt}
          fill
          className="object-cover object-[center_20%]"
          sizes="(max-width: 1024px) 100vw, 40vw"
          priority
        />
      </div>
      <figcaption className="mt-3 text-sm leading-snug text-muted-foreground md:mt-4">
        {FOUNDER_PORTRAIT.caption}
      </figcaption>
    </figure>
  );
}
