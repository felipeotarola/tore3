import Link from 'next/link';

import { EditableText } from '@/components/editing/editable-text';
import { Marquee } from '@/components/ui/marquee';
import { COLLABORATION_MARQUEE } from '@/lib/torekull';

const MARQUEE_PROJECT_LINKS: Record<(typeof COLLABORATION_MARQUEE)[number], string> = {
  Kasai: '/projects/kasai-stockholm',
  Moyagi: '/projects/moyagi-london',
  'La Botanica': '/projects/la-botanica',
  '3Sixty Skybar': '/projects/3sixty-skybar',
  'Biblioteket Live': '/projects/biblioteket-live-cocktail-bar',
  'Deck Brasserie': '/projects/deck-brasserie-bar',
  Chouchou: '/projects/chouchou',
  'Canta Lola': '/projects/canta-lola',
  Hallwylska: '/projects/hallwylska-bar',
  'Rose Club': '/projects/rose-club',
  'Walthon Advokater': '/projects/walthon-advokater-office',
  'Delish Bakehouse': '/projects/delish-bakehouse',
  'Cava Bar': '/projects/cava-bar-centralstation',
};

export const Logos = () => {
  return (
    <section className="section-padding-tight mask-r-from-40% mask-r-to-100% mask-l-from-40% mask-l-to-100% border-y">
      <Marquee pauseOnHover className="[--duration:24s] [--gap:5rem]">
        {COLLABORATION_MARQUEE.map((item, index) => (
          <Link
            key={item}
            href={MARQUEE_PROJECT_LINKS[item] ?? '/projects'}
            data-editor-lock-nav="true"
            className="animated-underline whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <EditableText
              as="span"
              copyKey={`home.logos.${index}`}
              fallback={item}
              className="nav-caps text-sm font-medium text-foreground/90 md:text-base"
            />
          </Link>
        ))}
      </Marquee>
    </section>
  );
};
