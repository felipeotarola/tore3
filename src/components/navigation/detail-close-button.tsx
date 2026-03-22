'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  const handleClose = () => {
    const hasInternalReferrer = (() => {
      if (!document.referrer) return false;
      try {
        return new URL(document.referrer).origin === window.location.origin;
      } catch {
        return false;
      }
    })();

    const navigate = () => {
      if (hasInternalReferrer) {
        router.back();
      } else {
        router.push(fallbackHref, { scroll: false });
      }
    };

    if (!document.startViewTransition) {
      navigate();
      return;
    }

    document.documentElement.classList.add(BACK_TRANSITION_CLASS);
    const transition = document.startViewTransition(() => {
      navigate();
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove(BACK_TRANSITION_CLASS);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Close and go back"
      onClick={handleClose}
      className={cn('relative z-[70] mt-14 md:mt-16', className)}
    >
      <X className="size-4" />
    </Button>
  );
}
