'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Logo from '@/components/layout/logo';
import { useBannerVisibility } from '@/hooks/use-banner-visibility';
import { CONTACT_EMAIL, NAV_ITEMS, SOCIAL_LINKS } from '@/lib/constants';
import { NAV_PRIMARY, TOREKULL } from '@/lib/torekull';
import { cn } from '@/lib/utils';

export const Navbar = ({
  initialBannerVisible = false,
}: {
  initialBannerVisible?: boolean;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const pathname = usePathname();
  const { isBannerVisible } = useBannerVisibility(initialBannerVisible);
  const lastScrollYRef = useRef(0);
  const isHomeRoute =
    pathname === '/' ||
    (!pathname &&
      typeof window !== 'undefined' &&
      window.location.pathname === '/');

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 50; // Minimum scroll before hiding

      if (currentScrollY < scrollThreshold) {
        // Always show navbar near the top
        setIsNavbarHidden(false);
      } else if (currentScrollY > lastScrollYRef.current) {
        // Scrolling down - hide navbar
        setIsNavbarHidden(true);
      } else {
        // Scrolling up - show navbar
        setIsNavbarHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    if (!isMenuOpen) {
      setIsOpening(true);
      setShouldRender(true);
      setIsAnimating(true);
      requestAnimationFrame(() => {
        setIsMenuOpen(true);
      });
    } else {
      setIsOpening(false);
      setIsMenuOpen(false);
      setIsAnimating(true);
    }
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    // When opening animation completes (column-five-open is last to finish)
    if (isMenuOpen && e.animationName === 'column-five-open') {
      setIsAnimating(false);
    }
    // When closing animation completes (column-five-close is last to finish)
    else if (!isMenuOpen && e.animationName === 'column-five-close') {
      setIsAnimating(false);
      setShouldRender(false);
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  return (
    <>
      <header
        className={cn(
          'bigger-container inset-x-0 z-50 flex items-center py-5 transition-transform duration-700 ease-in-out md:py-6',
          isHomeRoute && 'inset-x-5 pt-10.5 md:inset-x-6 md:py-12.5',
          isHomeRoute && 'text-background',
          pathname !== '/' && isMenuOpen && 'text-background',
          'fixed',
          isBannerVisible && 'mt-14', //banner height
          isNavbarHidden &&
            !isMenuOpen &&
            (isBannerVisible
              ? '-translate-y-[calc(100%+3.5rem)]'
              : '-translate-y-full'),
        )}
      >
        <div className="relative flex w-full items-center justify-between gap-6">
          {/* Hamburger - mobile only */}
          <button
            onClick={handleToggle}
            className={cn(
              'relative z-[60] h-3.5 w-[18px] shrink-0 cursor-pointer md:hidden',
              'after:absolute after:-inset-2 after:content-[""]',
            )}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open main menu</span>
            <div className="hamburger-lines">
              <span
                aria-hidden="true"
                className={cn(
                  'hamburger-line hamburger-line-1',
                  isMenuOpen && 'menu-open',
                )}
              ></span>
              <span
                aria-hidden="true"
                className={cn(
                  'hamburger-line hamburger-line-2',
                  isMenuOpen && 'menu-open',
                )}
              ></span>
              <span
                aria-hidden="true"
                className={cn(
                  'hamburger-line hamburger-line-3',
                  isMenuOpen && 'menu-open',
                )}
              ></span>
            </div>
          </button>

          {/* Logo — centered on mobile; hidden while overlay is open so it doesn’t cover nav */}
          <div
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0',
              'mt-2 max-w-[min(11rem,46vw)] md:mt-0 md:max-w-none',
              isMenuOpen && 'max-md:hidden',
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Logo
              className={cn(
                'h-16 w-auto md:h-20',
                'max-md:mx-auto max-md:max-h-16',
              )}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isMenuOpen ? 'open' : 'closed'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={cn('hidden items-center gap-8 md:flex')}
            >
              {isMenuOpen ? (
                <>
                  {SOCIAL_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      className="animated-underline flex h-9 items-center justify-center whitespace-nowrap"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <nav className="flex items-center gap-8">
                    {NAV_PRIMARY.map((item) => {
                      if (!('children' in item)) {
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'nav-caps animated-underline text-sm',
                              pathname === item.href && 'active-underline',
                            )}
                          >
                            {item.label}
                          </Link>
                        );
                      }

                      const isAboutActive =
                        pathname === item.href ||
                        item.children.some((child) => child.href === pathname);

                      return (
                        <div
                          key={item.href}
                          className="relative"
                          onMouseEnter={() => setIsAboutMenuOpen(true)}
                          onMouseLeave={() => setIsAboutMenuOpen(false)}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              'nav-caps animated-underline text-sm',
                              isAboutActive && 'active-underline',
                            )}
                          >
                            {item.label}
                          </Link>
                          <AnimatePresence>
                            {isAboutMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.2 }}
                                className="bg-background text-foreground border-border absolute top-8 left-0 min-w-[220px] border p-3 shadow-xl"
                              >
                                <div className="flex flex-col gap-2">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      className={cn(
                                        'nav-caps animated-underline text-xs',
                                        pathname === child.href &&
                                          'active-underline',
                                      )}
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </nav>


                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </header>

      <div
        className={cn(
          'bg-foreground text-background navbar-initial fixed inset-0 z-40',
          shouldRender && isMenuOpen && 'navbar-columns-open',
          shouldRender && !isMenuOpen && !isOpening && 'navbar-columns-close',
          !shouldRender && 'hidden',
        )}
        onAnimationEnd={handleAnimationEnd}
      >
        <nav
          className={cn(
            'flex h-full min-h-0 flex-col items-center justify-between px-4 py-6',
            'max-md:pt-[calc(5rem+env(safe-area-inset-top,0px))]',
          )}
        >
          <div
            className={cn(
              'flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6',
              'max-md:flex-none max-md:justify-start max-md:pt-2',
            )}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'animated-underline text-4xl uppercase tracking-[0.1em] after:-bottom-1 after:h-0.5',
                  pathname === item.href && 'active-underline',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2 text-sm">
            <Link className="animated-underline" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </Link>
            <span>{TOREKULL.phone}</span>
          </div>
          <div className="mt-8 flex items-center gap-6">
            {SOCIAL_LINKS.map((link) => (
              <Link
                key={link.name}
                className="animated-underline"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
              </Link>
            ))}
          </div>
          <Link className="animated-underline mt-8 text-xs uppercase tracking-[0.1em]" href="/">
            TOREKULL
          </Link>
        </nav>
      </div>

      <style jsx>{`
        /* Hamburger Menu Animation */
        .hamburger-lines {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
        }

        .hamburger-line {
          position: absolute;
          display: block;
          width: 100%;
          height: 2px;
          background-color: currentColor;
          border-radius: 9999px;
          transition: all 0.625s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hamburger-line-1 {
          top: 0;
          transform-origin: center;
        }

        .hamburger-line-1.menu-open {
          top: 50%;
          transform: translateY(-50%) scaleX(0.7) translateX(-20%);
          animation: hamburger-line-1-open 0.625s cubic-bezier(0.4, 0, 0.2, 1)
            forwards;
        }

        .hamburger-line-2 {
          top: 50%;
          transform: translateY(-50%);
          transform-origin: center;
        }

        .hamburger-line-2.menu-open {
          animation: hamburger-line-2-open 0.625s cubic-bezier(0.4, 0, 0.2, 1)
            forwards;
        }

        .hamburger-line-3 {
          bottom: 0;
          transform-origin: center;
        }

        .hamburger-line-3.menu-open {
          bottom: 50%;
          transform: translateY(50%) scaleX(0.7) translateX(-20%);
          animation: hamburger-line-3-open 0.625s cubic-bezier(0.4, 0, 0.2, 1)
            forwards;
        }

        @keyframes hamburger-line-1-open {
          0% {
            transform: translateY(-50%) scaleX(0.7) translateX(-20%);
          }
          50% {
            transform: translateY(-50%) scaleX(0.4) translateX(-40%);
          }
          100% {
            transform: translateY(-50%) scaleX(1) translateX(0) rotate(-45deg);
          }
        }

        @keyframes hamburger-line-2-open {
          0% {
            transform: translateY(-50%) scaleX(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-50%) scaleX(0.4);
            opacity: 0;
          }
          100% {
            transform: translateY(-50%) scaleX(0);
            opacity: 0;
          }
        }

        @keyframes hamburger-line-3-open {
          0% {
            transform: translateY(50%) scaleX(0.7) translateX(-20%);
          }
          50% {
            transform: translateY(50%) scaleX(0.4) translateX(-40%);
          }
          100% {
            transform: translateY(50%) scaleX(1) translateX(0) rotate(45deg);
          }
        }

        /* Initial state - fully hidden */
        .navbar-initial {
          clip-path: polygon(
            0 0%,
            0 0%,
            20% 0%,
            20% 0%,
            20% 0%,
            20% 0%,
            40% 0%,
            40% 0%,
            40% 0%,
            40% 0%,
            60% 0%,
            60% 0%,
            60% 0%,
            60% 0%,
            80% 0%,
            80% 0%,
            80% 0%,
            80% 0%,
            100% 0%,
            100% 0%
          );
        }

        @property --column-one {
          inherits: true;
          initial-value: 0;
          syntax: '<number>';
        }

        @property --column-two {
          inherits: true;
          initial-value: 0;
          syntax: '<number>';
        }

        @property --column-three {
          inherits: true;
          initial-value: 0;
          syntax: '<number>';
        }

        @property --column-four {
          inherits: true;
          initial-value: 0;
          syntax: '<number>';
        }

        @property --column-five {
          inherits: true;
          initial-value: 0;
          syntax: '<number>';
        }

        @keyframes column-one-open {
          from {
            --column-one: 0;
          }
          to {
            --column-one: 100;
          }
        }

        @keyframes column-two-open {
          from {
            --column-two: 0;
          }
          to {
            --column-two: 100;
          }
        }

        @keyframes column-three-open {
          from {
            --column-three: 0;
          }
          to {
            --column-three: 100;
          }
        }

        @keyframes column-four-open {
          from {
            --column-four: 0;
          }
          to {
            --column-four: 100;
          }
        }

        @keyframes column-five-open {
          from {
            --column-five: 0;
          }
          to {
            --column-five: 100;
          }
        }

        @keyframes column-one-close {
          from {
            --column-one: 100;
          }
          to {
            --column-one: 0;
          }
        }

        @keyframes column-two-close {
          from {
            --column-two: 100;
          }
          to {
            --column-two: 0;
          }
        }

        @keyframes column-three-close {
          from {
            --column-three: 100;
          }
          to {
            --column-three: 0;
          }
        }

        @keyframes column-four-close {
          from {
            --column-four: 100;
          }
          to {
            --column-four: 0;
          }
        }

        @keyframes column-five-close {
          from {
            --column-five: 100;
          }
          to {
            --column-five: 0;
          }
        }

        .navbar-columns-open {
          clip-path: polygon(
            0 0%,
            0 calc(var(--column-one) * 1%),
            20% calc(var(--column-one) * 1%),
            20% 0%,
            20% 0%,
            20% calc(var(--column-two) * 1%),
            40% calc(var(--column-two) * 1%),
            40% 0%,
            40% 0%,
            40% calc(var(--column-three) * 1%),
            60% calc(var(--column-three) * 1%),
            60% 0%,
            60% 0%,
            60% calc(var(--column-four) * 1%),
            80% calc(var(--column-four) * 1%),
            80% 0%,
            80% 0%,
            80% calc(var(--column-five) * 1%),
            100% calc(var(--column-five) * 1%),
            100% 0%
          );
          --speed: 0.625;
          animation:
            column-one-open calc(var(--speed) * 1s)
              calc(sin((4 / 5) * 45deg) * var(--speed) * 1s),
            column-two-open calc(var(--speed) * 1s)
              calc(sin((3 / 5) * 45deg) * var(--speed) * 1s),
            column-three-open calc(var(--speed) * 1s)
              calc(sin((2 / 5) * 45deg) * var(--speed) * 1s),
            column-four-open calc(var(--speed) * 1s)
              calc(sin((1 / 5) * 45deg) * var(--speed) * 1s),
            column-five-open calc(var(--speed) * 1s)
              calc(sin((0 / 5) * 45deg) * var(--speed) * 1s);
          animation-fill-mode: both;
          animation-timing-function: linear(
            0 0%,
            0.0027 3.64%,
            0.0106 7.29%,
            0.0425 14.58%,
            0.0957 21.87%,
            0.1701 29.16%,
            0.2477 35.19%,
            0.3401 41.23%,
            0.5982 55.18%,
            0.7044 61.56%,
            0.7987 68.28%,
            0.875 75%,
            0.9297 81.25%,
            0.9687 87.5%,
            0.9922 93.75%,
            1 100%
          );
        }

        .navbar-columns-close {
          clip-path: polygon(
            0 0%,
            0 calc(var(--column-one) * 1%),
            20% calc(var(--column-one) * 1%),
            20% 0%,
            20% 0%,
            20% calc(var(--column-two) * 1%),
            40% calc(var(--column-two) * 1%),
            40% 0%,
            40% 0%,
            40% calc(var(--column-three) * 1%),
            60% calc(var(--column-three) * 1%),
            60% 0%,
            60% 0%,
            60% calc(var(--column-four) * 1%),
            80% calc(var(--column-four) * 1%),
            80% 0%,
            80% 0%,
            80% calc(var(--column-five) * 1%),
            100% calc(var(--column-five) * 1%),
            100% 0%
          );
          --speed: 0.625;
          animation:
            column-one-close calc(var(--speed) * 1s)
              calc(sin((0 / 5) * 45deg) * var(--speed) * 1s),
            column-two-close calc(var(--speed) * 1s)
              calc(sin((1 / 5) * 45deg) * var(--speed) * 1s),
            column-three-close calc(var(--speed) * 1s)
              calc(sin((2 / 5) * 45deg) * var(--speed) * 1s),
            column-four-close calc(var(--speed) * 1s)
              calc(sin((3 / 5) * 45deg) * var(--speed) * 1s),
            column-five-close calc(var(--speed) * 1s)
              calc(sin((4 / 5) * 45deg) * var(--speed) * 1s);
          animation-fill-mode: both;
          animation-timing-function: linear(
            0 0%,
            0.0027 3.64%,
            0.0106 7.29%,
            0.0425 14.58%,
            0.0957 21.87%,
            0.1701 29.16%,
            0.2477 35.19%,
            0.3401 41.23%,
            0.5982 55.18%,
            0.7044 61.56%,
            0.7987 68.28%,
            0.875 75%,
            0.9297 81.25%,
            0.9687 87.5%,
            0.9922 93.75%,
            1 100%
          );
        }
      `}</style>
    </>
  );
};
