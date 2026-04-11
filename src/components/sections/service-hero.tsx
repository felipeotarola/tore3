import Image from 'next/image';

import { cn } from '@/lib/utils';

interface ServiceHeroProps {
  title: string;
  image: string;
}

export const ServiceHero = ({ title, image }: ServiceHeroProps) => {
  return (
    <section
      className={cn('hero-padding space-y-18 md:space-y-20 lg:space-y-26')}
    >
      <h1 className="container text-center text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>

      <div className="bigger-container">
        <div className="relative h-[335px] w-full overflow-hidden rounded-md md:h-[450px] lg:h-[900px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
};
