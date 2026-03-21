import { Metadata } from 'next';

import { Process } from '@/components/sections/process';
import { SERVICES } from '@/lib/torekull';
import { WHAT_WE_DO_PROCESS } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'What We Do',
};

export default function WhatWeDoPage() {
  return (
    <>
      <section className="hero-padding container space-y-10">
        <h1 className="text-5xl md:text-6xl">WHAT WE DO</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          TOREKULL Interior Architecture offers creative and innovative
          solutions within interior architecture, furniture and product design.
        </p>
      </section>

      <section className="section-padding container grid gap-6 md:grid-cols-2">
        {SERVICES.map((service) => (
          <article key={service.title} className="bg-card border-border border p-8">
            <h2 className="text-2xl">{service.title}</h2>
            <p className="text-muted-foreground mt-4">{service.description}</p>
          </article>
        ))}
      </section>

      <Process title="Process" steps={[...WHAT_WE_DO_PROCESS]} />

      <section className="section-padding container">
        <div className="bg-primary text-primary-foreground p-8 md:p-10">
          <p className="nav-caps text-xs">Specialties</p>
          <p className="mt-4 max-w-3xl text-xl leading-relaxed">
            TOREKULL specializes in commercial properties: hotels, restaurants,
            bars, cafes and boutiques.
          </p>
        </div>
      </section>
    </>
  );
}

