import Image from 'next/image';
import Link from 'next/link';

import { EnrichedProject } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: EnrichedProject;
  showName?: boolean;
  className?: string;
}

export function ProjectCard({
  project,
  showName = true,
  className,
}: ProjectCardProps) {
  const {
    Logo,
    images = [],
    name,
    slug,
    logoClassName,
    imageClassName,
    hideLogoOverlay,
  } = project;
  const primaryImage = images[0] ?? {
    src: 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg',
    alt: `${name} primary image`,
  };

  return (
    <Link href={`/projects/${slug}`} className={cn('group flex flex-col items-start gap-4')}>
      <div className={cn('relative h-full w-full overflow-hidden', className)}>
        <Image
          src={primaryImage.src}
          alt={primaryImage.alt}
          fill
          quality={90}
          className={cn(
            'object-cover transition-all duration-500 ease-out group-hover:scale-110',
            imageClassName,
            !hideLogoOverlay && 'group-hover:blur-[5px]',
          )}
          sizes="(max-width: 1023px) 100vw, 33vw"
          priority
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/3" />
        {!hideLogoOverlay && Logo && (
          <div className="absolute inset-0 flex items-center justify-center transition-all delay-50 duration-1000 ease-out group-hover:scale-80">
            <Logo className={cn('flex h-24 text-white', logoClassName)} wordmarkClassName="hidden" />
          </div>
        )}
      </div>
      {showName && <h3 className="text-lg">{name}</h3>}
    </Link>
  );
}
