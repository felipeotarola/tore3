import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PolymorphicProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
};

export function PageShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('bg-background text-foreground', className)}>{children}</div>;
}

export function Container({
  wide = false,
  className,
  children,
}: {
  wide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(wide ? 'bigger-container' : 'container', className)}>
      {children}
    </div>
  );
}

export function Section({
  border = false,
  tight = false,
  className,
  children,
}: {
  border?: boolean;
  tight?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        tight ? 'tk-section-tight' : 'tk-section',
        border && 'tk-section-border',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow<T extends ElementType = 'p'>({
  as,
  className,
  children,
}: PolymorphicProps<T>) {
  const Comp = as ?? 'p';
  return <Comp className={cn('tk-eyebrow', className)}>{children}</Comp>;
}

export function Lead<T extends ElementType = 'p'>({
  as,
  className,
  children,
}: PolymorphicProps<T>) {
  const Comp = as ?? 'p';
  return <Comp className={cn('tk-lead', className)}>{children}</Comp>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  centered = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={cn(
        'tk-section-header',
        action && 'md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-end',
        centered && 'mx-auto max-w-3xl text-center',
        className,
      )}
    >
      <div className={cn('min-w-0 space-y-2', centered && 'mx-auto')}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="tk-section-title">{title}</h2>
        {description ? <Lead>{description}</Lead> : null}
      </div>
      {action ? <div className="mt-4 md:mt-0">{action}</div> : null}
    </div>
  );
}

export function MetadataGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <dl className={cn('tk-metadata-grid', className)}>
      {children}
    </dl>
  );
}

export function MetadataItem({
  label,
  children,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="tk-meta-label">{label}</dt>
      <dd className="tk-meta-value">{children}</dd>
    </div>
  );
}
