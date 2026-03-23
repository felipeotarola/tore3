'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CopyEmailButtonProps = {
  email: string;
  className?: string;
};

export function CopyEmailButton({ email, className }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn(
        'shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200',
        className,
      )}
      onClick={handleCopy}
      aria-label={copied ? 'Email copied' : 'Copy email address'}
      title={copied ? 'Copied' : 'Copy email'}
    >
      {copied ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email copied to clipboard' : ''}
      </span>
    </Button>
  );
}
