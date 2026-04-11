'use client';

import Image from 'next/image';

import { ProjectImageClickable } from '@/components/sections/project-image-lightbox';
import { ProjectImage } from '@/lib/types';

interface ProjectGalleryProps {
  images: ProjectImage[];
  /** Index of the first image in the full project `images[]` array (e.g. 5 when template uses slots 0–4). */
  imageIndexOffset?: number;
}

export function ProjectGallery({
  images,
  imageIndexOffset = 0,
}: ProjectGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="section-padding bigger-container">
      <div className="grid gap-6 md:grid-cols-2">
        {images.map((image, index) => {
          const globalIndex = imageIndexOffset + index;
          return (
            <div
              key={`${image.src}-${globalIndex}`}
              className="relative h-[335px] w-full overflow-hidden rounded-md md:h-[450px] lg:h-[900px]"
            >
              <ProjectImageClickable
                imageIndex={globalIndex}
                className="relative h-full w-full"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </ProjectImageClickable>
            </div>
          );
        })}
      </div>
    </section>
  );
}
