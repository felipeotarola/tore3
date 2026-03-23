import { MapPin, Phone } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { ContactForm } from '@/components/contact/contact-form';
import { CopyEmailButton } from '@/components/contact/copy-email-button';
import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { FOUNDER_PORTRAIT, TOREKULL } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'Contact',
};

function googleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function ContactPage() {
  return (
    <section className="hero-padding container pb-12 md:pb-14">
      <div className="flex flex-col gap-12 lg:gap-16">
        <DetailCloseButton fallbackHref="/" />

        {/* Row 1: headline + three-column info (Contact 20-style) */}
        <div className="grid gap-12 md:gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)] lg:items-start lg:gap-16 xl:gap-24">
          <div className="space-y-5">
            <p className="nav-caps text-xs text-muted-foreground">Contact</p>
            <h1 className="text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-[1.08] xl:text-6xl">
              Let&apos;s create something extraordinary.
            </h1>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed md:text-base">
              {FOUNDER_PORTRAIT.caption}
            </p>
          </div>

          <div className="grid min-w-0 gap-y-8 md:grid-cols-2 md:gap-x-10 md:gap-y-10 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
            <div className="space-y-4">
              <p className="nav-caps text-xs text-muted-foreground">Studio 1</p>
              <Link
                href={googleMapsUrl(TOREKULL.addresses[0])}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-start gap-2.5 rounded-sm py-1 text-sm leading-snug outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
                aria-label={`Open Studio 1 in Google Maps: ${TOREKULL.addresses[0]}`}
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

            <div className="space-y-4">
              <p className="nav-caps text-xs text-muted-foreground">Studio 2</p>
              <Link
                href={googleMapsUrl(TOREKULL.addresses[1])}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-start gap-2.5 rounded-sm py-1 text-sm leading-snug outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
                aria-label={`Open Studio 2 in Google Maps: ${TOREKULL.addresses[1]}`}
              >
                <MapPin
                  className="text-muted-foreground group-hover:text-foreground mt-0.5 size-4 shrink-0 transition-colors"
                  aria-hidden
                />
                <span className="animated-underline text-muted-foreground group-hover:text-foreground">
                  {TOREKULL.addresses[1]}
                </span>
              </Link>
            </div>

            <div className="space-y-4 md:col-span-2 lg:col-span-1">
              <p className="nav-caps text-xs text-muted-foreground">Direct</p>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Link
                    href={`mailto:${TOREKULL.email}`}
                    className="animated-underline font-display font-weight-display text-foreground text-2xl tracking-[0.02em] md:text-3xl"
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
        </div>

        {/* Borderless grid form */}
        <div className="border-border space-y-10 border-t pt-12 md:pt-14 lg:pt-16">
          <div className="grid gap-8 md:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:gap-14 xl:gap-20">
            <div className="space-y-3 lg:pt-1">
              <p className="nav-caps text-xs text-muted-foreground">Project inquiry</p>
              <h2 className="font-display font-weight-display text-2xl tracking-[0.02em] md:text-3xl">
                Share your vision
              </h2>
              <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                A few details help us respond with the right team and timeline - expect a
                personal reply, not an automated ticket.
              </p>
            </div>
            <ContactForm />
          </div>

          <div className="border-border flex flex-wrap items-center gap-x-8 gap-y-2 border-t pt-10">
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
      </div>
    </section>
  );
}

