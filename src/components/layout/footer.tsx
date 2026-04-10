'use client';

import { Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

import Logo from '@/components/layout/logo';
import { TOREKULL } from '@/lib/torekull';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Collaborations', href: '/collaborations' },
  { label: 'Contact', href: '/contact' },
];

const Footer = () => {
  return (
    <div className="section-padding pb-0!">
      <footer className="bg-background text-muted-foreground relative m-5 mt-0! overflow-hidden border border-border py-10 md:m-6 md:py-11">
        <div className="bigger-container space-y-6 md:space-y-8">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] md:items-start md:gap-10 lg:gap-16">
            {/* Brand — narrow column so nav + contact keep room */}
            <div className="flex min-w-0 max-w-[17rem] flex-col gap-3 md:gap-4">
              <Logo className="h-16 w-auto md:h-[4.25rem]" />
              <blockquote className="text-muted-foreground/70 text-sm italic leading-snug">
                &quot;{TOREKULL.quote}&quot;{' '}
                <cite className="not-italic text-muted-foreground/50">— {TOREKULL.quoteAuthor}</cite>
              </blockquote>
            </div>

            {/* Nav | Contact: two columns from md; addresses stack (no side-by-side lines) */}
            <div className="grid min-w-0 grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-x-10 lg:gap-x-14 xl:gap-x-16">
              <nav
                aria-label="Footer"
                className="flex min-w-0 flex-col gap-2 self-start"
              >
                {footerLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="animated-underline w-fit text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="min-w-0 space-y-3 text-sm">
                <h3 className="nav-caps text-xs">Contact</h3>
                <div className="flex flex-col gap-1">
                  <Link
                    className="animated-underline break-words"
                    href={`mailto:${TOREKULL.email}`}
                  >
                    {TOREKULL.email}
                  </Link>
                  <Link
                    className="animated-underline w-fit"
                    href={`tel:${TOREKULL.phone.replace(/[^\d+]/g, '')}`}
                  >
                    {TOREKULL.phone}
                  </Link>
                </div>
                <div className="text-muted-foreground/85 flex flex-col gap-2 leading-snug">
                  {TOREKULL.addressesShort.map((address) => (
                    <p key={address} className="min-w-0">
                      {address}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-border space-y-6 border-t pt-6">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm">
              <Link
                href={TOREKULL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="animated-underline inline-flex items-center gap-2"
              >
                <Instagram className="size-4 shrink-0" aria-hidden />
                Instagram
              </Link>
              <Link
                href={TOREKULL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="animated-underline inline-flex items-center gap-2"
              >
                <Facebook className="size-4 shrink-0" aria-hidden />
                Facebook
              </Link>
            </div>

            <div className="border-border flex flex-col gap-2 border-t pt-5 text-sm md:flex-row md:items-center md:justify-between">
              <p>© 2025 TOREKULL. All Rights Reserved.</p>
              <p className="text-muted-foreground/70">Stockholm, Sweden</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
