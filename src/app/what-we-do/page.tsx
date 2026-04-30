import { ArrowUpRight } from 'lucide-react';
import { Metadata } from 'next';

import { DetailPageHeader } from '@/components/navigation/detail-page-header';
import { Process } from '@/components/sections/process';
import { ServicesHoverTable } from '@/components/what-we-do/services-hover-table';
import { WHAT_WE_DO_PROCESS } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'What We Do',
};

export default function WhatWeDoPage() {
  return (
    <>
      <DetailPageHeader
        fallbackHref="/"
        eyebrow="What we do"
        title="Practice & services"
        description="TOREKULL delivers interior architecture, furniture, and product work for hospitality and commercial spaces—from first sketch through site delivery."
        contentClassName="max-w-4xl"
        titleClassName="max-w-4xl text-5xl leading-[0.95] tracking-[-0.045em] md:text-6xl lg:text-7xl"
        descriptionClassName="max-w-2xl text-base md:text-lg"
      />

      <ServicesHoverTable />

      <Process
        className="py-10 md:py-12 lg:py-14"
        title="Process"
        steps={[...WHAT_WE_DO_PROCESS]}
      />

      <section className="container pb-10 md:pb-12 lg:pb-14">
        <div className="group flex items-start justify-between gap-8 bg-primary p-6 text-primary-foreground md:p-8 lg:p-10">
          <div>
            <p className="nav-caps text-[11px] tracking-[0.2em] opacity-70">
              Specialties
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-relaxed md:text-xl">
              TOREKULL specializes in commercial properties: hotels, restaurants,
              bars, cafes and boutiques.
            </p>
          </div>

          <ArrowUpRight className="mt-1 size-5 shrink-0 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </section>
    </>
  );
}
