import { ArrowUpRight } from 'lucide-react';
import { Metadata } from 'next';

import { DetailPageHeader } from '@/components/navigation/detail-page-header';
import { Process } from '@/components/sections/process';
import { ServicesHoverTable } from '@/components/what-we-do/services-hover-table';
import { SERVICES, WHAT_WE_DO_PROCESS } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'What We Do',
};

type WhatWeDoPageProps = {
  searchParams?: Promise<{
    service?: string | string[];
  }>;
};

export default async function WhatWeDoPage({ searchParams }: WhatWeDoPageProps) {
  const params = await searchParams;
  const serviceSlug = Array.isArray(params?.service)
    ? params.service[0]
    : params?.service;
  const selectedService = SERVICES.find((service) => service.slug === serviceSlug);

  return (
    <>
      <DetailPageHeader
        fallbackHref={selectedService ? '/what-we-do' : '/'}
        eyebrow="What we do"
        title={selectedService?.title ?? 'Practice & services'}
        description={
          selectedService?.description ??
          'TOREKULL delivers interior architecture, furniture, and product work for hospitality and commercial spaces—from first sketch through site delivery.'
        }
        titleClassName="max-w-4xl"
        descriptionClassName="max-w-2xl"
      />

      <ServicesHoverTable />

      <Process
        className="py-10 md:py-12 lg:py-14"
        title="Process"
        steps={[...WHAT_WE_DO_PROCESS]}
      />

      <section className="container tk-section-tight">
        <div className="group flex items-start justify-between gap-8 rounded-md border border-border/70 bg-card/25 p-5 md:p-6 lg:p-8">
          <div>
            <p className="nav-caps text-[11px] tracking-[0.2em] text-muted-foreground">
              Specialties
            </p>

            <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground md:text-lg">
              TOREKULL specializes in commercial properties: hotels, restaurants,
              bars, cafes and boutiques.
            </p>
          </div>

          <ArrowUpRight className="text-muted-foreground mt-1 size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </section>
    </>
  );
}
