'use client';

import { useLandingCopyEditor } from '@/components/editing/landing-copy-editor-provider';

type EditableTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';

type EditableTextProps = {
  as?: EditableTag;
  copyKey: string;
  fallback: string;
  className?: string;
  id?: string;
  singleLine?: boolean;
};

export function EditableText({
  as = 'span',
  copyKey,
  fallback,
  className,
  id,
}: EditableTextProps) {
  const Tag = as;
  const { copy } = useLandingCopyEditor();
  const text = copy[copyKey] ?? fallback;

  return (
    <Tag className={className} id={id}>
      {text}
    </Tag>
  );
}
