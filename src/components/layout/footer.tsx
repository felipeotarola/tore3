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
    <div className="pt-8 md:pt-10">
      <footer className="container bg-background text-muted-foreground relative border-t border-border/70 py-9 md:py-11">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] md:gap-12 lg:gap-16">
          <div className="space-y-5">
            <div className="text-foreground">
              <Logo className="h-20 w-auto sm:h-24" />
            </div>
            <p className="tk-lead max-w-sm">
              Interior architecture and design for hospitality, commercial spaces,
              custom furniture, and product work.
            </p>
          </div>

          <div className="grid items-start gap-8 border-y border-border/60 py-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <nav aria-label="Footer">
              <h3 className="tk-meta-label mb-4 text-foreground/70">Pages</h3>
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
              <h3 className="tk-meta-label mb-4 text-foreground/70">Studio</h3>
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
        </div>

        <div className="mt-8 space-y-5 md:mt-10">
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
      </footer>
    </div>
  );
};

export default Footer;
