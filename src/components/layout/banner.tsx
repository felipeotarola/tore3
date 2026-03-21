'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useBannerVisibility } from '@/hooks/use-banner-visibility';
import { cn } from '@/lib/utils';

const Banner = ({
  url = 'https://shadcnblocks.com',
  initialVisible = true,
}: {
  url?: string;
  initialVisible?: boolean;
}) => {
  const { isBannerVisible, dismissBanner } =
    useBannerVisibility(initialVisible);

  const handleDismiss = () => {
    // Hook handles both cookie setting and event dispatching
    dismissBanner();
  };

  return (
    <div
      className={cn(
        'bg-primary relative overflow-hidden transition-all duration-300',
        // Use max-height and opacity for smooth transitions
        isBannerVisible ? 'h-14 opacity-100' : 'max-h-0 opacity-0',
        // Hide completely after transition
        !isBannerVisible && 'pointer-events-none',
      )}
      style={{
        // Prevent layout shift by using grid with rows
        display: 'grid',
        gridTemplateRows: isBannerVisible ? '1fr' : '0fr',
      }}
    >
      <div className="overflow-hidden">
        <div className="container flex items-center justify-between gap-4 py-3 pr-12">
          <div className="flex flex-1 items-center justify-center gap-3 sm:gap-4">
            <span className="text-primary-foreground text-center text-sm">
              Purchase this theme on{' '}
              <span className="font-semibold">shadcnblocks.com</span>
            </span>
            <Button size="sm" variant="secondary" asChild>
              <a href={url} target="_blank">
                Get Template
              </a>
            </Button>
          </div>
          <button
            onClick={handleDismiss}
            className={cn(
              'absolute top-1/2 right-4 -translate-y-1/2 rounded-sm p-1.5',
              'text-primary-foreground/70 hover:text-primary-foreground',
              'transition-all duration-200 hover:scale-110 hover:bg-white/10',
              'focus:ring-2 focus:ring-white/30 focus:outline-none',
            )}
            aria-label="Close banner"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
