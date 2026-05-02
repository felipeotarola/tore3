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

const mid = Math.ceil(footerLinks.length / 2);
const footerLinksCol1 = footerLinks.slice(0, mid);
const footerLinksCol2 = footerLinks.slice(mid);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="pt-10 md:pt-14">
      <footer className="container bg-background text-muted-foreground relative border-t border-border/60 py-10 md:py-12">
        <div className="flex flex-col gap-9 md:gap-12">
          <div className="text-foreground flex flex-col items-center justify-center px-2">
            <Logo className="h-24 w-auto sm:h-28 md:h-32 lg:h-36" />
          </div>

          <div className="grid items-start gap-8 border-y border-border/60 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 xl:gap-16">
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-2.5">
                {footerLinksCol1.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="animated-underline inline-block text-sm text-foreground/78 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="More pages">
              <ul className="flex flex-col gap-2.5">
                {footerLinksCol2.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="animated-underline inline-block text-sm text-foreground/78 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0 space-y-3 text-sm sm:col-span-2 lg:col-span-1">
              <h3 className="tk-meta-label text-foreground/70">Contact</h3>
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
              <div className="text-muted-foreground flex flex-col gap-2 leading-snug">
                {TOREKULL.addressesShort.map((address) => (
                  <p key={address} className="min-w-0">
                    {address}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
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
              <p>
                © {year} TOREKULL. All Rights Reserved.
              </p>
              <p className="text-muted-foreground/70">Stockholm, Sweden</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
