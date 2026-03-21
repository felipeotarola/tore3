import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TOREKULL } from '@/lib/torekull';

export const metadata: Metadata = {
  title: 'Contact',
};

const serviceInterests = [
  'Interior Architecture',
  'Furniture Design',
  'Product Design',
  'Concept Development',
];

export default function ContactPage() {
  return (
    <section className="hero-padding container grid gap-12 md:grid-cols-2">
      <div className="space-y-8">
        <h1 className="text-4xl">Let&apos;s create something extraordinary.</h1>
        <div className="space-y-3 text-lg">
          <p>
            <span className="text-muted-foreground block text-sm">Email</span>
            <Link className="animated-underline" href={`mailto:${TOREKULL.email}`}>
              {TOREKULL.email}
            </Link>
          </p>
          <p>
            <span className="text-muted-foreground block text-sm">Phone</span>
            <Link
              className="animated-underline"
              href={`tel:${TOREKULL.phone.replace(/[^\d+]/g, '')}`}
            >
              {TOREKULL.phone}
            </Link>
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">Studio 1</p>
          <p>{TOREKULL.addresses[0]}</p>
          <p className="text-muted-foreground mt-4 text-sm">Studio 2</p>
          <p>{TOREKULL.addresses[1]}</p>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <Link
            href={TOREKULL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="animated-underline nav-caps text-xs"
          >
            Instagram
          </Link>
          <Link
            href={TOREKULL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="animated-underline nav-caps text-xs"
          >
            Facebook
          </Link>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex flex-col gap-4">
          <Label className="text-base">What can we help you with?</Label>
          <div className="flex flex-wrap gap-3">
            {serviceInterests.map((service) => (
              <Button
                key={service}
                variant="outline"
                type="button"
                className="border-border hover:border-foreground/50 rounded-full transition-colors"
              >
                {service}
              </Button>
            ))}
          </div>
        </div>

        <form className="space-y-4">
          <Input type="text" placeholder="Your name" />

          <Input type="email" placeholder="Your email" />

          <Input type="text" placeholder="Company name" />

          <Textarea
            placeholder="Tell us about your project, timeline, and location..."
            className="resize-none"
          />

          <Button type="submit" size="lg" className="mt-6">
            Send inquiry
          </Button>
        </form>
      </div>
    </section>
  );
}
