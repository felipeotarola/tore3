'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const BACK_TRANSITION_CLASS = 'page-transition-back';

type DetailCloseButtonProps = {
  fallbackHref: string;
  className?: string;
  compact?: boolean;
  label?: string;
};

export function DetailCloseButton({
  fallbackHref,
  className,
  compact = false,
  label,
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

  const buttonLabel =
    label ??
    (fallbackHref === '/projects'
      ? 'Back to projects'
      : fallbackHref === '/press'
        ? 'Back to press'
        : 'Back');

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={buttonLabel}
      onClick={handleClose}
      className={cn(
        'relative z-[70] rounded-full px-3 text-muted-foreground shadow-none transition-colors hover:text-foreground',
        compact && 'h-8 px-2.5 text-xs',
        className,
      )}
    >
      <ArrowLeft className={cn('size-4', compact && 'size-3.5')} />
      <span>{compact && fallbackHref === '/' ? 'Back' : buttonLabel}</span>
    </Button>
  );
}
