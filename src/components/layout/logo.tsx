import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" aria-label="TOREKULL">
      <Image
        src="https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/brand/Torekull_logo_new2.png"
        alt="TOREKULL"
        width={328}
        height={80}
        priority
        className={cn('h-8 w-auto object-contain', className)}
      />
    </Link>
  );
};

export default Logo;

