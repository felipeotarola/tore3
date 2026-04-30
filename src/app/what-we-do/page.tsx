import { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';

import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { Process } from '@/components/sections/process';
import { ServicesHoverTable } from '@/components/what-we-do/services-hover-table';
import { WHAT_WE_DO_PROCESS } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'What We Do',
};

export default function WhatWeDoPage() {
  return (
    <>
      <section className="container pt-10 pb-12 md:pt-14 md:pb-14 lg:pt-16 lg:pb-16">
        <div className="max-w-3xl space-y-5">
          <DetailCloseButton fallbackHref="/" />

          <div className="space-y-3">
            <p className="nav-caps text-[11px] tracking-[0.2em] text-muted-foreground">
              What we do
            </p>

            <h1 className="max-w-4xl text-5xl leading-[0.95] tracking-[-0.045em] md:text-6xl lg:text-7xl">
              Practice &amp; services
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              TOREKULL delivers interior architecture, furniture, and product work
              for hospitality and commercial spaces—from first sketch through site
              delivery.
            </p>
          </div>
        </div>
      </section>

      <ServicesHoverTable />

      <section className="container py-12 md:py-14 lg:py-16">
        <Process title="Process" steps={[...WHAT_WE_DO_PROCESS]} />
      </section>

      <section className="container pb-14 md:pb-16 lg:pb-20">
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