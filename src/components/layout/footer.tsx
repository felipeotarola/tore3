'use client';

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
      <footer className="bg-foreground text-background relative m-5 mt-0! overflow-hidden py-12 md:m-6 md:py-14">
        <div className="bigger-container space-y-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
            <div className="space-y-8">
              <Logo className="h-24" />
              <p className="text-background/70 text-sm italic">
                &quot;{TOREKULL.quote}&quot; - {TOREKULL.quoteAuthor}
              </p>
            </div>

            <div className="space-y-4">
              <nav className="flex flex-col gap-2">
                {footerLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="animated-underline w-fit text-sm">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-4">
              <h3 className="nav-caps text-xs">Contact</h3>
              <div className="space-y-1 text-sm">
                <Link className="animated-underline w-fit block" href={`mailto:${TOREKULL.email}`}>
                  {TOREKULL.email}
                </Link>
                <Link className="animated-underline w-fit block" href={`tel:${TOREKULL.phone.replace(/[^\d+]/g, '')}`}>
                  {TOREKULL.phone}
                </Link>
              </div>
              <div className="space-y-1 text-sm">
                {TOREKULL.addresses.map((address) => (
                  <p key={address}>{address}</p>
                ))}
              </div>
              <div className="flex items-center gap-6 pt-2 text-sm">
                <Link
                  href={TOREKULL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animated-underline"
                >
                  Instagram
                </Link>
                <Link
                  href={TOREKULL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animated-underline"
                >
                  Facebook
                </Link>
              </div>
            </div>
          </div>

          <div className="border-background/25 flex flex-col gap-4 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between">
            <p>© 2025 TOREKULL. All Rights Reserved.</p>
            <p className="text-background/80">Stockholm, Sweden</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
