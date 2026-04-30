import { Metadata } from 'next';

import { LandingCopyEditorProvider } from '@/components/editing/landing-copy-editor-provider';
import { CaseStudies } from '@/components/sections/case-studies';
import { Hero } from '@/components/sections/hero';
import { Logos } from '@/components/sections/logos';
import { PressPreview } from '@/components/sections/press-preview';
import { Services } from '@/components/sections/services';
import { HERO_POSTER_SRC, HERO_VIDEO_SRC } from '@/lib/torekull';
import { HomeProofBlock } from '@/components/sections/home-awards';

export const metadata: Metadata = {
  title: 'TOREKULL - Interior Architecture and Design',
};

export default function Home() {
  return (
    <LandingCopyEditorProvider>
      <link rel="preload" href={HERO_POSTER_SRC} as="image" fetchPriority="high" />
      <link rel="preload" href={HERO_VIDEO_SRC} as="video" type="video/mp4" />

      <Hero />
      <HomeProofBlock />
      <CaseStudies />
      <Services />
      <Logos />
      <PressPreview />
    </LandingCopyEditorProvider>
  );
}