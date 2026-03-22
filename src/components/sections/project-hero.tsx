import Image from 'next/image';

import { ProjectImage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProjectHeroProps {
  title: string;
  image: ProjectImage;
  eyebrow?: string;
  className?: string;
}

export function ProjectHero({
  title,
  image,
  eyebrow,
  className,
}: ProjectHeroProps) {
  return (
    <section className={cn('space-y-12 pb-12 md:space-y-14 md:pb-14', className)}>
      <div className="container space-y-4 text-center">
        {eyebrow && (
          <p className="nav-caps text-muted-foreground text-xs">{eyebrow}</p>
        )}
        <h1 className="text-5xl md:text-6xl lg:text-7xl">{title}</h1>
      </div>
      <div className="bigger-container">
        <div className="border-border bg-card relative mx-auto aspect-[4/3] w-full max-w-[1400px] overflow-hidden rounded-sm border md:aspect-[3/2]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
