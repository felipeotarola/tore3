import type { ReactNode } from 'react';

import { DetailCloseButton } from '@/components/navigation/detail-close-button';
import { cn } from '@/lib/utils';

type DetailPageHeaderProps = {
  fallbackHref: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  centered?: boolean;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function DetailPageHeader({
  fallbackHref,
  eyebrow,
  title,
  description,
  centered = false,
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: DetailPageHeaderProps) {
  return (
    <section
      className={cn(
        'container relative pt-8 pb-10 md:pt-8 md:pb-12 lg:pt-8 lg:pb-14',
        className,
      )}
    >
      <div
        className={cn(
          'w-full',
          centered ? 'text-center' : '',
          contentClassName,
        )}
      >
        {centered ? (
          <>
            <div>
              <div className="nav-caps mb-3 flex items-center justify-between gap-4 text-[11px] tracking-[0.2em] text-muted-foreground">
                {eyebrow ? <span>{eyebrow}</span> : <span aria-hidden />}
                <DetailCloseButton fallbackHref={fallbackHref} compact />
              </div>
              <h1
                className={cn(
                  'text-4xl leading-tight tracking-[-0.035em] md:text-5xl lg:text-6xl',
                  titleClassName,
                )}
              >
                {title}
              </h1>
              {description ? (
                <div
                  className={cn(
                    'mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base',
                    descriptionClassName,
                  )}
                >
                  {description}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div>
            <div className="nav-caps mb-3 flex items-center justify-between gap-4 text-[11px] tracking-[0.2em] text-muted-foreground">
              {eyebrow ? <span>{eyebrow}</span> : <span aria-hidden />}
              <DetailCloseButton fallbackHref={fallbackHref} compact />
            </div>
            <h1
              className={cn(
                'text-4xl leading-tight tracking-[-0.035em] md:text-5xl lg:text-6xl',
                titleClassName,
              )}
            >
              {title}
            </h1>
            {description ? (
              <div
                className={cn(
                  'mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base',
                  descriptionClassName,
                )}
              >
                {description}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
