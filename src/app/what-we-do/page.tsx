import { Metadata } from 'next';

import { Process } from '@/components/sections/process';
import { ServicesHoverTable } from '@/components/what-we-do/services-hover-table';
import { WHAT_WE_DO_PROCESS } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'What We Do',
};

export default function WhatWeDoPage() {
  return (
    <>
      <section className="hero-padding container space-y-6">
        <p className="nav-caps text-xs text-muted-foreground">What we do</p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl">Practice &amp; services</h1>
        <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
          TOREKULL delivers interior architecture, furniture, and product work for
          hospitality and commercial spaces—from first sketch through site delivery.
        </p>
      </section>

      <ServicesHoverTable />

      <Process title="Process" steps={[...WHAT_WE_DO_PROCESS]} />

      <section className="section-padding container">
        <div className="bg-primary text-primary-foreground p-8 md:p-10">
          <p className="nav-caps text-xs opacity-90">Specialties</p>
          <p className="mt-4 max-w-3xl text-xl leading-relaxed">
            TOREKULL specializes in commercial properties: hotels, restaurants, bars,
            cafes and boutiques.
          </p>
        </div>
      </section>
    </>
  );
}
