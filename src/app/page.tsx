import { Metadata } from 'next';

import { AboutIntro } from '@/components/sections/about-intro';
import { CaseStudies } from '@/components/sections/case-studies';
import { Hero } from '@/components/sections/hero';
import { Logos } from '@/components/sections/logos';
import { PressPreview } from '@/components/sections/press-preview';
import { Services } from '@/components/sections/services';
import { HERO_POSTER_SRC, HERO_VIDEO_SRC } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'TOREKULL - Interior Architecture and Design',
};

export default function Home() {
  return (
    <>
      <link
        rel="preload"
        href={HERO_POSTER_SRC}
        as="image"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href={HERO_VIDEO_SRC}
        as="video"
        type="video/mp4"
      />
      <Hero />
      <AboutIntro />
      <CaseStudies />
      <Services />
      <Logos />
      <PressPreview />
    </>
  );
}
