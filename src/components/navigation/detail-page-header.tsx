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
        'container pt-10 pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14',
        className,
      )}
    >
      <div
        className={cn(
          centered
            ? 'relative mx-auto max-w-4xl text-center'
            : 'grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start',
          contentClassName,
        )}
      >
        {centered ? (
          <>
            <div className="mb-5 flex justify-end md:absolute md:top-0 md:right-0 md:mb-0">
              <DetailCloseButton fallbackHref={fallbackHref} />
            </div>
            <div>
              {eyebrow ? (
                <div className="nav-caps mb-3 text-[11px] tracking-[0.2em] text-muted-foreground">
                  {eyebrow}
                </div>
              ) : null}
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
          <>
            <div>
              {eyebrow ? (
                <div className="nav-caps mb-3 text-[11px] tracking-[0.2em] text-muted-foreground">
                  {eyebrow}
                </div>
              ) : null}
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
            <DetailCloseButton
              fallbackHref={fallbackHref}
              className="mt-1 justify-self-end"
            />
          </>
        )}
      </div>
    </section>
  );
}
