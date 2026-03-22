import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const Cta = () => {
  return (
    <section className="section-padding container">
      <div className="flex flex-col items-center gap-8 text-center">
        <h2 className="mx-auto w-full max-w-2xl text-center text-4xl">
          Let&apos;s create something extraordinary.
        </h2>

        <Button variant="outline" size="lg" className="h-12 gap-4 ps-1 pe-4" asChild>
          <Link href="/contact">
            <div className="bg-muted flex items-center rounded-sm p-1">
              <Image
                src="https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/brand/Torekull_logo_new1.png"
                alt="TOREKULL"
                width={38}
                height={38}
                className="object-cover"
              />
            </div>
            <span>Work with TOREKULL</span>
          </Link>
        </Button>
      </div>
    </section>
  );
};
