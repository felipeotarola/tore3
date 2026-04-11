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
    <div className="section-padding pb-0!">
      <footer className="bg-background text-muted-foreground relative border-t border-border/50 py-10 md:py-12">
        <div className="bigger-container flex flex-col gap-12 md:gap-16">
          {/* Centered statement mark — strong end-of-page anchor */}
          <div className="flex flex-col items-center justify-center px-2 py-2 md:py-4">
            <Logo className="h-40 w-auto sm:h-44 md:h-52 lg:h-60 xl:h-[16rem]" />
          </div>

          {/* Three columns: two link groups + contact (shadcnblocks footer7 pattern) */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 xl:gap-16">
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-2">
                {footerLinksCol1.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="animated-underline inline-block text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="More pages">
              <ul className="flex flex-col gap-2">
                {footerLinksCol2.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="animated-underline inline-block text-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0 space-y-3 text-sm sm:col-span-2 lg:col-span-1">
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
