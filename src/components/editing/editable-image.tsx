'use client';

import Image, { type ImageProps } from 'next/image';

import { useLandingCopyEditor } from '@/components/editing/landing-copy-editor-provider';

type EditableImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  srcKey: string;
  fallbackSrc: string;
  altKey?: string;
  fallbackAlt: string;
};

export function EditableImage({
  srcKey,
  fallbackSrc,
  altKey,
  fallbackAlt,
  ...imageProps
}: EditableImageProps) {
  const { copy } = useLandingCopyEditor();

  const rawSrc = copy[srcKey] ?? fallbackSrc;
  const rawAlt = (altKey ? copy[altKey] : undefined) ?? fallbackAlt;

  const resolvedSrc = rawSrc.trim() || fallbackSrc;
  const resolvedAlt = rawAlt.trim() || fallbackAlt;

  return <Image src={resolvedSrc} alt={resolvedAlt} {...imageProps} />;
}


