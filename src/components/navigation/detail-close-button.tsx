'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BACK_TRANSITION_CLASS = 'page-transition-back';

type DetailCloseButtonProps = {
  fallbackHref: string;
  className?: string;
};

export function DetailCloseButton({
  fallbackHref,
  className,
}: DetailCloseButtonProps) {
  const router = useRouter();
  const isClosingRef = useRef(false);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (!document.startViewTransition) {
      router.replace(fallbackHref, { scroll: false });
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.setTimeout(() => {
        isClosingRef.current = false;
      }, 1200);
      return;
    }

    document.documentElement.classList.add(BACK_TRANSITION_CLASS);

    const transition = document.startViewTransition(() => {
      router.replace(fallbackHref, { scroll: false });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove(BACK_TRANSITION_CLASS);
      isClosingRef.current = false;
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Close and go back"
      onClick={handleClose}
      className={cn(
        'relative z-[70] size-10 rounded-full border-border/80 bg-background/80 text-muted-foreground shadow-none backdrop-blur-sm transition-colors hover:border-foreground/30 hover:text-foreground',
        className,
      )}
    >
      <X className="size-4" />
    </Button>
  );
}
