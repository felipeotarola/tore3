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
        'container relative pt-32 pb-10 md:pt-36 md:pb-12 lg:pt-40 lg:pb-14',
        className,
      )}
    >
      <DetailCloseButton
        fallbackHref={fallbackHref}
        className="absolute top-4 right-4 md:top-8 md:right-8"
      />

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
        )}
      </div>
    </section>
  );
}
