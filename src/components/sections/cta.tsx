import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Cta = () => {
  return (
    <section className={cn('section-padding container space-y-10')}>
      <h2 className="text-4xl">Let&apos;s create something extraordinary.</h2>

      <Button
        variant="outline"
        size="lg"
        className="h-12 gap-4 ps-1 pe-4"
        asChild
      >
        <Link href="/contact">
          <div className="bg-muted flex items-center rounded-full p-1">
            <Image
              src="/images/torekull/brand/Torekull_logo_new1.png"
              alt="TOREKULL"
              width={38}
              height={38}
              className="object-cover"
            />
          </div>
          <span>Work with TOREKULL</span>
        </Link>
      </Button>
    </section>
  );
};

