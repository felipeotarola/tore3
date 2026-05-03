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
        'tk-page-hero',
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
              <div className="tk-eyebrow mb-5 flex items-center justify-between gap-4">
                {eyebrow ? <span>{eyebrow}</span> : <span aria-hidden />}
                <DetailCloseButton fallbackHref={fallbackHref} compact />
              </div>
              <h1
                className={cn(
                  'tk-page-title mx-auto max-w-5xl',
                  titleClassName,
                )}
              >
                {title}
              </h1>
              {description ? (
                <div
                  className={cn(
                    'tk-lead mx-auto mt-4',
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
            <div className="tk-eyebrow mb-5 flex items-center justify-between gap-4">
              {eyebrow ? <span>{eyebrow}</span> : <span aria-hidden />}
              <DetailCloseButton fallbackHref={fallbackHref} compact />
            </div>
            <h1
              className={cn(
                'tk-page-title max-w-5xl',
                titleClassName,
              )}
            >
              {title}
            </h1>
            {description ? (
              <div
                className={cn(
                  'tk-lead mt-4',
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
