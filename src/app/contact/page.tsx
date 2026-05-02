import { MapPin, Phone } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { ContactForm } from '@/components/contact/contact-form';
import { CopyEmailButton } from '@/components/contact/copy-email-button';
import { DetailPageHeader } from '@/components/navigation/detail-page-header';
import { FOUNDER_PORTRAIT, TOREKULL } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'Contact',
};

function googleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function ContactPage() {
  return (
    <>
      <DetailPageHeader
        fallbackHref="/"
        eyebrow="Contact"
        title="Let's create something extraordinary."
        description={FOUNDER_PORTRAIT.caption}
        titleClassName="max-w-3xl"
        descriptionClassName="max-w-md"
      />

      <section className="container tk-section-tight tk-section-border">
        <div className="grid min-w-0 gap-y-7 md:grid-cols-2 md:gap-x-10 md:gap-y-10">
          <div className="space-y-3">
            <p className="tk-meta-label">Studio</p>
            <Link
              href={googleMapsUrl(TOREKULL.addresses[0])}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-start gap-2.5 rounded-sm py-1 text-sm leading-snug outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
              aria-label={`Open Studio in Google Maps: ${TOREKULL.addresses[0]}`}
            >
              <MapPin
                className="text-muted-foreground group-hover:text-foreground mt-0.5 size-4 shrink-0 transition-colors"
                aria-hidden
              />
              <span className="animated-underline text-muted-foreground group-hover:text-foreground">
                {TOREKULL.addresses[0]}
              </span>
            </Link>
          </div>

          <div className="space-y-3">
            <p className="tk-meta-label">Direct</p>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Link
                  href={`mailto:${TOREKULL.email}`}
                  className="animated-underline font-display font-weight-display text-foreground text-2xl tracking-[0.01em] md:text-[1.7rem]"
                >
                  {TOREKULL.email}
                </Link>
                <CopyEmailButton email={TOREKULL.email} />
              </div>
              <Link
                className="animated-underline text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-2 rounded-sm py-1 text-base transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
                href={`tel:${TOREKULL.phone.replace(/[^\d+]/g, '')}`}
              >
                <Phone className="size-4 shrink-0" aria-hidden />
                {TOREKULL.phone}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container tk-section-tight tk-section-border pb-12 md:pb-16 lg:pb-20">
        <div className="space-y-8">
          <div className="grid gap-7 md:gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12 xl:gap-16">
            <div className="space-y-3 lg:pt-1">
              <p className="tk-meta-label">Project inquiry</p>
              <h2 className="tk-section-title">Share your vision</h2>
              <p className="tk-lead">
                A few details help us respond with the right team and timeline -
                expect a personal reply, not an automated ticket.
              </p>
            </div>
            <ContactForm />
          </div>

          <div className="border-border/70 flex flex-wrap items-center gap-x-8 gap-y-2 border-t pt-8">
            <Link
              href={TOREKULL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="animated-underline nav-caps text-xs text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center rounded-sm py-2 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
            >
              Instagram
            </Link>
            <Link
              href={TOREKULL.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="animated-underline nav-caps text-xs text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center rounded-sm py-2 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
            >
              Facebook
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
