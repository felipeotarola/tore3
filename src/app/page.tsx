import { Metadata } from 'next';

import { AboutIntro } from '@/components/sections/about-intro';
import { CaseStudies } from '@/components/sections/case-studies';
import { Hero } from '@/components/sections/hero';
import { Logos } from '@/components/sections/logos';
import { PressPreview } from '@/components/sections/press-preview';
import { Services } from '@/components/sections/services';

export const metadata: Metadata = {
  title: 'TOREKULL - Interior Architecture and Design',
};

export default function Home() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <CaseStudies />
      <Services />
      <Logos />
      <PressPreview />
    </>
  );
}
